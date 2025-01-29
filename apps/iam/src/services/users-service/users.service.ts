import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import randomstring from 'randomstring';

import { IJwtService } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	LoginDto,
	RegistrationDto,
} from '~libs/dto/iam';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';
import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';
import { api, HTTPError, IJwtPayload, MailerService } from '~libs/common';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';
import { TPrismaService } from '~/iam/common/types/prisma-service.interface';

import { IUsersService } from './users.service.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.UserFactory) private userFactory: IUserFactory,
		@inject(TYPES.PrismaService) private prismaService: TPrismaService,
		@inject(TYPES.JwtService) private jwtService: IJwtService,
		@inject(TYPES.MailerService) private mailerService: MailerService
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

			const otp = randomstring.generate({ charset: 'numeric', length: 6 });
			const testMailUrl = await this.mailerService.sendMail({
				to: registerDto.email,
				subject: 'Email Verification Code',
				text: `Your Email Verification Code is: ${otp}`,
				html: `<p>Your Email Verification Code is: <h1>${otp}</h1></p>`,
			});

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

	async changePassword(
		{ id, email, username }: IJwtPayload,
		{ password, newPassword }: ChangePasswordDto
	): Promise<UserModel> {
		const validatedUser = await this.validate({ userIdentifier: email || username, password });

		if (password === newPassword) {
			throw new HTTPError(400, 'new password cannot be the same as the old one');
		}

		const user = await this.userFactory.create({ ...validatedUser, password: newPassword });
		return this.usersRepository.update(id, {
			password: user.password,
			passwordUpdatedAt: new Date(),
		});
	}

	async changeEmail({ id, email }: IJwtPayload, { newEmail }: ChangeEmailDto): Promise<UserModel> {
		if (newEmail === email) {
			throw new HTTPError(400, 'new email cannot be the same as the old one');
		}

		const userWithSameEmail = await this.usersRepository.findBy({ email: newEmail });
		if (userWithSameEmail) {
			throw new HTTPError(400, `account with this email already exists`);
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
			throw new HTTPError(400, 'new username cannot be the same as the old one');
		}

		const userWithSameUsername = await this.usersRepository.findBy({ username: newUsername });
		if (userWithSameUsername) {
			throw new HTTPError(400, `account with this username already exists`);
		}

		return this.usersRepository.update(id, {
			username: newUsername,
		});
	}
}
