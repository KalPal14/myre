import { User } from '../user';

export interface IUserFactoryCreateArgs
	extends Omit<User, 'comperePassword' | 'setPassword' | 'passwordUpdatedAt' | 'colors'> {
	passwordUpdatedAt?: Date | null;
	colors?: string[];
}

export interface IUserFactory {
	create: (userData: IUserFactoryCreateArgs) => Promise<User>;
	createWithHashPassword: (userData: IUserFactoryCreateArgs) => User;
}
