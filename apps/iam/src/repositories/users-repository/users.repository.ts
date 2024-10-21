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

	findBy(findData: Partial<UserModel>): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: findData,
		});
	}

	create(user: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: user,
		});
	}

	update(id: number, payload: Partial<User>): Promise<UserModel> {
		return this.prismaService.client.userModel.update({
			where: { id },
			data: payload,
		});
	}
}
