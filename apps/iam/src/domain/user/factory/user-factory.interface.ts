import { User } from '../user';

export interface IUserFactoryCreateArgs
	extends Omit<User, 'comperePassword' | 'setPassword' | 'passwordUpdatedAt'> {
	passwordUpdatedAt?: Date | null;
}

export interface IUserFactory {
	create: (userData: IUserFactoryCreateArgs) => Promise<User>;
	createWithHashPassword: (userData: IUserFactoryCreateArgs) => User;
}
