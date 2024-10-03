import { UserModel } from '~/iam/prisma/client';
import { IUser } from '~/iam/entities/user-entity/user.entity.interface';

export interface IUsersRepository {
	findByEmail: (email: string) => Promise<UserModel | null>;
	findByUsername: (username: string) => Promise<UserModel | null>;
	findById: (id: number) => Promise<UserModel | null>;

	create: (user: IUser) => Promise<UserModel>;
	update: (id: number, payload: Partial<IUser>) => Promise<UserModel>;
}
