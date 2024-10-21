import { User } from '~/iam/domain/user/user';
import { UserModel } from '~/iam/prisma/client';

export interface IUsersRepository {
	findBy: (findData: Partial<UserModel>) => Promise<UserModel | null>;

	create: (user: User) => Promise<UserModel>;
	update: (id: number, payload: Partial<User>) => Promise<UserModel>;
}
