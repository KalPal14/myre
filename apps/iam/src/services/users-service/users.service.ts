import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IJwtPayload, HTTPError, IConfigService } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { User } from '~/iam/entities/user-entity/user.entity';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';

import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {}

	async getUserInfo(id: number): Promise<UserModel | null> {
		return await this.usersRepository.findById(id);
	}

	async createUser({ username, email, password }: UsersRegisterDto): Promise<UserModel | Error> {
		const newUser = new User(username, email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

		let existingUser = await this.usersRepository.findByEmail(newUser.email);
		if (existingUser) {
			return new HTTPError(422, 'User with this email already exists');
		}
		existingUser = await this.usersRepository.findByUsername(newUser.username);
		if (existingUser) {
			return new HTTPError(422, 'User with this username already exists');
		}

		return await this.usersRepository.create(newUser.getData());
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

		const user = new User(
			existingUser.username,
			existingUser.email,
			existingUser.passwordUpdatedAt,
			existingUser.password
		);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			return new HTTPError(422, 'Incorrect password');
		}
		return existingUser;
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

		const user = new User(validatedUser.username, validatedUser.email);
		const salt = this.configService.get('SALT');
		await user.setPassword(newPassword, Number(salt));
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
