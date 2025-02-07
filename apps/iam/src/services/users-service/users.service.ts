import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { LoginDto, RegistrationDto, UpdateUserDto } from '~libs/dto/iam';
import { HTTPError, IJwtPayload } from '~libs/common';

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
		@inject(TYPES.OtpService) private otpService: IOtpService
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

	async create(
		registerDto: RegistrationDto
	): Promise<{ user: UserModel; testMailUrl: string | null }> {
		try {
			return await this.prismaService.client.$transaction(async (tx) => {
				const newUser = await this.userFactory.create(registerDto);
				const newUserEntity = await tx.userModel.create({ data: newUser });

				const { testMailUrl } = await this.otpService.upsert(newUser);

				return { user: newUserEntity, testMailUrl };
			});
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

		if (dto.updateViaOtp) {
			await this.otpService.validate({
				email: dto.updateViaOtp.email ?? user.email,
				code: dto.updateViaOtp.code.toString(),
			});
		}

		try {
			return await this.usersRepository.update(user.id, {
				username: dto.username,
				email: dto.updateViaOtp?.email,
				verified: dto.updateViaOtp?.verified,
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
