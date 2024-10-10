import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IConfigService, HTTPError, IJwtPayload } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UpdateUserDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/highlight-extension';

import { UserModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IUsersRepository } from '~/highlight-extension/repositories/users-repository/users.repository.interface';
import { IUserFactory } from '~/highlight-extension/domain/user/factory/user-factory.interface';

import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserFactory) private userFactory: IUserFactory
	) {}

	async getUserInfo(id: number): Promise<UserModel | null> {
		return await this.usersRepository.findById(id);
	}

	async createUser(userDto: UsersRegisterDto): Promise<UserModel | Error> {
		const newUser = await this.userFactory.create(userDto);

		let existingUser = await this.usersRepository.findByEmail(newUser.email);
		if (existingUser) {
			return new HTTPError(422, 'User with this email already exists');
		}
		existingUser = await this.usersRepository.findByUsername(newUser.username);
		if (existingUser) {
			return new HTTPError(422, 'User with this username already exists');
		}

		return await this.usersRepository.create(newUser);
	}

	async validateUser({ userIdentifier, password }: UsersLoginDto): Promise<UserModel | Error> {
		let existingUser = null;

		if (userIdentifier.includes('@')) {
			existingUser = await this.usersRepository.findByEmail(userIdentifier);
			if (!existingUser) {
				return new HTTPError(422, 'There is no user with this email');
			}
		} else {
			existingUser = await this.usersRepository.findByUsername(userIdentifier);
			if (!existingUser) {
				return new HTTPError(422, 'There is no user with this username');
			}
		}

		const user = this.userFactory.createWithHashPassword(existingUser);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			return new HTTPError(422, 'Incorrect password');
		}
		return existingUser;
	}

	async updateUser(id: number, payload: UpdateUserDto): Promise<UserModel> {
		return await this.usersRepository.update(id, payload);
	}

	async changePassword(
		{ id, email, username }: IJwtPayload,
		{ password, newPassword }: ChangePasswordDto
	): Promise<UserModel | Error> {
		const validatedUser = await this.validateUser({ userIdentifier: email || username, password });
		if (validatedUser instanceof Error) {
			return Error(validatedUser.message);
		}
		if (password === newPassword) {
			return Error('The new password cannot be the same as the old one');
		}

		const user = await this.userFactory.create(validatedUser);
		return await this.usersRepository.update(id, {
			password: user.password,
			passwordUpdatedAt: new Date(),
		});
	}

	async changeEmail(
		{ id, email }: IJwtPayload,
		{ newEmail }: ChangeEmailDto
	): Promise<UserModel | Error> {
		if (newEmail === email) {
			return Error('The new email cannot be the same as the old one');
		}
		const isNewEmailExisting = await this.usersRepository.findByEmail(newEmail);
		if (isNewEmailExisting) {
			return Error(`An account with this email already exists`);
		}

		return await this.usersRepository.update(id, {
			email: newEmail,
		});
	}

	async changeUsername(
		{ id, username }: IJwtPayload,
		{ newUsername }: ChangeUsernameDto
	): Promise<UserModel | Error> {
		if (newUsername === username) {
			return Error('The new username cannot be the same as the old one');
		}
		const isNewUsernameExisting = await this.usersRepository.findByUsername(newUsername);
		if (isNewUsernameExisting) {
			return Error(` An account with this username already exists`);
		}

		return await this.usersRepository.update(id, {
			username: newUsername,
		});
	}
}
