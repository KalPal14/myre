import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IJwtPayload } from '~libs/common';
import { HTTPError } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';

import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.UserFactory) private userFactory: IUserFactory
	) {}

	async get(id: number): Promise<UserModel> {
		const user = await this.usersRepository.findBy({ id });
		if (!user) {
			throw new HTTPError(422, `user #${id} not found`);
		}

		return user;
	}

	async create(registerDto: UsersRegisterDto): Promise<UserModel> {
		let existingUser = await this.usersRepository.findBy({ email: registerDto.email });
		if (existingUser) {
			throw new HTTPError(422, 'user with this email already exists');
		}
		existingUser = await this.usersRepository.findBy({ username: registerDto.username });
		if (existingUser) {
			throw new HTTPError(422, 'user with this username already exists');
		}

		const newUser = await this.userFactory.create(registerDto);
		return this.usersRepository.create(newUser);
	}

	async validate({ userIdentifier, password }: UsersLoginDto): Promise<UserModel> {
		let existingUser = null;
		if (userIdentifier.includes('@')) {
			existingUser = await this.usersRepository.findBy({ email: userIdentifier });
			if (!existingUser) {
				throw new HTTPError(422, 'There is no user with this email');
			}
		} else {
			existingUser = await this.usersRepository.findBy({ username: userIdentifier });
			if (!existingUser) {
				throw new HTTPError(422, 'There is no user with this username');
			}
		}

		const user = this.userFactory.createWithHashPassword(existingUser);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			throw new HTTPError(422, 'Incorrect password');
		}
		return existingUser;
	}

	async changePassword(
		{ id, email, username }: IJwtPayload,
		{ password, newPassword }: ChangePasswordDto
	): Promise<UserModel> {
		const validatedUser = await this.validate({ userIdentifier: email || username, password });

		if (password === newPassword) {
			throw new HTTPError(422, 'new password cannot be the same as the old one');
		}

		const user = await this.userFactory.create({ ...validatedUser, password: newPassword });
		return this.usersRepository.update(id, {
			password: user.password,
			passwordUpdatedAt: new Date(),
		});
	}

	async changeEmail({ id, email }: IJwtPayload, { newEmail }: ChangeEmailDto): Promise<UserModel> {
		if (newEmail === email) {
			throw new HTTPError(422, 'new email cannot be the same as the old one');
		}

		const userWithSameEmail = await this.usersRepository.findBy({ email: newEmail });
		if (userWithSameEmail) {
			throw new HTTPError(422, `account with this email already exists`);
		}

		return this.usersRepository.update(id, {
			email: newEmail,
		});
	}

	async changeUsername(
		{ id, username }: IJwtPayload,
		{ newUsername }: ChangeUsernameDto
	): Promise<UserModel> {
		if (newUsername === username) {
			throw new HTTPError(422, 'new username cannot be the same as the old one');
		}

		const userWithSameUsername = await this.usersRepository.findBy({ username: newUsername });
		if (userWithSameUsername) {
			throw new HTTPError(422, `account with this username already exists`);
		}

		return this.usersRepository.update(id, {
			username: newUsername,
		});
	}
}
