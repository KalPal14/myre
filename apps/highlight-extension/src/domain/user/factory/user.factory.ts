import { injectable } from 'inversify';

import { User } from '../user';

import { IUserFactory, IUserFactoryCreateArgs } from './user-factory.interface';

@injectable()
export class UserFactory implements IUserFactory {
	async create({
		username,
		email,
		password,
		passwordUpdatedAt = null,
		colors,
	}: IUserFactoryCreateArgs): Promise<User> {
		const salt = process.env.SALT!;
		const user = new User(username, email, passwordUpdatedAt, colors);
		await user.setPassword(password, +salt);
		return user;
	}

	createWithHashPassword({
		username,
		email,
		password,
		passwordUpdatedAt = null,
		colors,
	}: IUserFactoryCreateArgs): User {
		return new User(username, email, passwordUpdatedAt, colors, password);
	}
}
