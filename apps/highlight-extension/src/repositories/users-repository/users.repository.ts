import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { UserModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { User } from '~/highlight-extension/entities/user-entity/user.entity';
import { IUser } from '~/highlight-extension/entities/user-entity/user.entity.interface';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';

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

	async create({ email, username, password }: IUser): Promise<UserModel> {
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
