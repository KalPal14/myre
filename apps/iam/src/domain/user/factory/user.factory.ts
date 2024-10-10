import { inject, injectable } from 'inversify';

import { IConfigService } from '~libs/express-core';

import { TYPES } from '~/iam/common/constants/types';

import { User } from '../user';

import { IUserFactory, IUserFactoryCreateArgs } from './user-factory.interface';

@injectable()
export class UserFactory implements IUserFactory {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async create({
		username,
		email,
		password,
		passwordUpdatedAt = null,
	}: IUserFactoryCreateArgs): Promise<User> {
		const salt = this.configService.get('SALT');
		const user = new User(username, email, passwordUpdatedAt);
		await user.setPassword(password, +salt);
		return user;
	}

	createWithHashPassword({
		username,
		email,
		password,
		passwordUpdatedAt = null,
	}: IUserFactoryCreateArgs): User {
		return new User(username, email, passwordUpdatedAt, password);
	}
}
