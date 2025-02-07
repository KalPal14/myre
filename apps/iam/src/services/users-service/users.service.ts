import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { LoginDto, RegistrationDto, UpdateUserDto } from '~libs/dto/iam';
import { HTTPError, IJwtPayload } from '~libs/common';

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
			throw new HTTPError(400, `user #${id} not found`);
		}

		return user;
	}

	async find(data: Partial<UserModel>): Promise<UserModel | null> {
		return this.usersRepository.findBy(data);
	}

	async create(registerDto: RegistrationDto): Promise<UserModel> {
		try {
			const newUser = await this.userFactory.create(registerDto);
			return await this.usersRepository.create(newUser);
		} catch (err: any) {
			if (err.code === 'P2002') {
				throw new HTTPError(400, `User with this ${err.meta.target} already exists`);
			}
			throw new Error();
		}
	}

	async validate({ userIdentifier, password }: LoginDto): Promise<UserModel> {
		let existingUser = null;
		if (userIdentifier.includes('@')) {
			existingUser = await this.usersRepository.findBy({ email: userIdentifier });
			if (!existingUser) {
				throw new HTTPError(400, 'There is no user with this email');
			}
		} else {
			existingUser = await this.usersRepository.findBy({ username: userIdentifier });
			if (!existingUser) {
				throw new HTTPError(400, 'There is no user with this username');
			}
		}

		const user = this.userFactory.createWithHashPassword(existingUser);
		const isPasswordTrue = await user.comperePassword(password);
		if (!isPasswordTrue) {
			throw new HTTPError(400, 'Incorrect password');
		}
		return existingUser;
	}

	async update(user: IJwtPayload, dto: UpdateUserDto): Promise<UserModel> {
		let updatedPassword: string | undefined;
		let passwordUpdatedAt: Date | undefined;
		if (dto.password) {
			await this.validate({ userIdentifier: user.email, password: dto.password.currentPassword });
			updatedPassword = await this.userFactory
				.create({ ...user, password: dto.password.newPassword })
				.then(({ password }) => password);
			passwordUpdatedAt = new Date();
		}

		try {
			return await this.usersRepository.update(user.id, {
				username: dto.username,
				email: dto.email,
				password: updatedPassword,
				passwordUpdatedAt,
			});
		} catch (err: any) {
			if (err.code === 'P2002') {
				throw new HTTPError(400, `User with this ${err.meta.target} already exists`);
			}
			throw new Error();
		}
	}
}
