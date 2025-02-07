import { User } from '../user';

export interface IUserData
	extends Omit<User, 'comperePassword' | 'setPassword' | 'passwordUpdatedAt'> {
	passwordUpdatedAt?: Date | null;
}

export interface IUserFactory {
	create: (userData: IUserData) => Promise<User>;
	createWithHashPassword: (userData: IUserData) => User;
}
