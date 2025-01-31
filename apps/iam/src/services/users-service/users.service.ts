import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { IJwtService } from '~libs/express-core';
import { LoginDto, RegistrationDto, UpdateUserDto } from '~libs/dto/iam';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';
import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';
import { api, HTTPError, IJwtPayload } from '~libs/common';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';
import { TPrismaService } from '~/iam/common/types/prisma-service.interface';

import { IOtpService } from '../otp-service/otp.service.interface';

import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.UserFactory) private userFactory: IUserFactory,
		@inject(TYPES.PrismaService) private prismaService: TPrismaService,
		@inject(TYPES.JwtService) private jwtService: IJwtService,
		@inject(TYPES.OtpService) private otpService: IOtpService
	) {}

	async get(id: number): Promise<UserModel> {
		const user = await this.usersRepository.findBy({ id });
		if (!user) {
			throw new HTTPError(400, `user #${id} not found`);
		}

		return user;
	}

	async create(
		registerDto: RegistrationDto
	): Promise<{ user: UserModel; workspace: ICreateWorkspaceRo; testMailUrl: string | null }> {
		let existingUser = await this.usersRepository.findBy({ email: registerDto.email });
		if (existingUser) {
			throw new HTTPError(400, 'user with this email already exists');
		}
		existingUser = await this.usersRepository.findBy({ username: registerDto.username });
		if (existingUser) {
			throw new HTTPError(400, 'user with this username already exists');
		}

		return await this.prismaService.client.$transaction(async (tx) => {
			const newUser = await this.userFactory.create(registerDto);
			const newUserEntity = await tx.userModel.create({ data: newUser });

			const jwt = await this.jwtService.generate({
				id: newUserEntity.id,
				email: newUser.email,
				username: newUser.username,
			});
			const workspace = await api.post<CreateWorkspaceDto, ICreateWorkspaceRo>(
				WORKSPACES_URLS.create,
				{
					name: `${newUser.username}'s workspace`,
					colors: [],
				},
				{ headers: { Authorization: `Bearer ${jwt}` } }
			);

			if (workspace instanceof HTTPError) throw new Error();

			const { testMailUrl } = await this.otpService.upsert(newUser);

			return { user: newUserEntity, workspace, testMailUrl };
		});
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
		if (dto.password) {
			await this.validate({ userIdentifier: user.email, password: dto.password.currentPassword });
			updatedPassword = await this.userFactory
				.create({ ...user, password: dto.password.newPassword })
				.then(({ password }) => password);
		}

		if (dto.updateViaOtp) {
			await this.otpService.validate({
				email: dto.updateViaOtp.email ?? user.email,
				code: dto.updateViaOtp.code,
			});
		}

		try {
			return await this.usersRepository.update(user.id, {
				username: dto.username,
				email: dto.updateViaOtp?.email,
				verified: dto.updateViaOtp?.verified,
				password: updatedPassword,
			});
		} catch (err: any) {
			if (err.code === 'P2002') {
				throw new HTTPError(400, `User with this ${err.meta.target} already exists`);
			}
			throw new Error();
		}
	}
}
