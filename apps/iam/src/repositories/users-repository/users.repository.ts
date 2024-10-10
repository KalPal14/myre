import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { User } from '~/iam/domain/user/user';
import { TPrismaService } from '~/iam/common/types/prisma-service.interface';

import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	async findByEmail(email: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}

	async findByUsername(username: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findFirst({
			where: {
				username,
			},
		});
	}

	async findById(id: number): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findFirst({
			where: {
				id,
			},
		});
	}

	async create({ email, username, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				username,
				password,
			},
		});
	}

	async update(id: number, payload: Partial<User>): Promise<UserModel> {
		return await this.prismaService.client.userModel.update({
			where: { id },
			data: payload,
		});
	}
}
