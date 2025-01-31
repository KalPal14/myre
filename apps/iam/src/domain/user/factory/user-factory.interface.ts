import { User } from '../user';

export interface IUserData
	extends Omit<User, 'comperePassword' | 'setPassword' | 'passwordUpdatedAt' | 'verified'> {
	passwordUpdatedAt?: Date | null;
	verified?: boolean;
}

export interface IUserFactory {
	create: (userData: IUserData) => Promise<User>;
	createWithHashPassword: (userData: IUserData) => User;
}
