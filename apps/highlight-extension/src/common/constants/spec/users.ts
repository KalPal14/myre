import { IJwtPayload } from '~libs/express-core';
import { random } from '~libs/common';

import { UserModel } from '~/highlight-extension/prisma/client';

type TExtendedUserModel = UserModel & {
	passwordHash: string;
};

export const RIGHT_USER: TExtendedUserModel = {
	id: 1,
	email: 'alex@test.com',
	username: 'alex_test',
	password: '123123',
	passwordUpdatedAt: null,
	passwordHash: '$2a$13$kk2.WnMMchuXJEETn1dak.fQDgjLMu.3mO44dGv50C5qx1/oP.9wa',
	colors: [],
};

export const UPDATED_USER: TExtendedUserModel = {
	id: 1,
	email: 'updated@test.com',
	username: 'updated_updated',
	password: '123123123',
	passwordUpdatedAt: new Date(),
	passwordHash: '$2a$13$kk2.WnMMchuXJEETn1dak.fQDgjLMu.3mO44dGv50C5qx1/oP.9wa',
	colors: ['#ff4455', '#000', '#777'],
};

export const GET_NEW_USER = (): Omit<TExtendedUserModel, 'id' | 'passwordHash'> => ({
	email: `new_${random()}@test.com`,
	username: `new_new_${random()}`,
	password: '123123',
	passwordUpdatedAt: null,
	colors: [],
});

export const GET_UPDATED_USER = (): Omit<TExtendedUserModel, 'id' | 'passwordHash'> => ({
	email: `updated_${random()}@test.com`,
	username: `updated_updated_${random()}`,
	password: '123123123',
	passwordUpdatedAt: new Date(),
	colors: ['#ff4455', '#000', '#777'],
});

export const WRONG_USER: TExtendedUserModel = {
	id: 500,
	email: 'wrong@test.com',
	username: 'wrong_name',
	password: 'wrong_password',
	passwordUpdatedAt: null,
	passwordHash: '$2a$13$kk2.WnMMchuXJEETn1dak.fQDgjLMu.3mO44dGv50C5qx1/oP.9w4',
	colors: [],
};

export const INVALID_USER: Partial<TExtendedUserModel> = {
	username: 'test test',
	colors: ['color1', 'color2'],
};

export const RIGHT_USER_JWT: IJwtPayload = {
	id: RIGHT_USER.id,
	username: RIGHT_USER.username,
	email: RIGHT_USER.email,
};
