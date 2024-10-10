import { User } from '~/highlight-extension/domain/user/user';
import { UserModel } from '~/highlight-extension/prisma/client';

export interface IUsersRepository {
	findByEmail: (email: string) => Promise<UserModel | null>;
	findByUsername: (username: string) => Promise<UserModel | null>;
	findById: (id: number) => Promise<UserModel | null>;

	create: (user: User) => Promise<UserModel>;
	update: (id: number, payload: Partial<User>) => Promise<UserModel>;
}
