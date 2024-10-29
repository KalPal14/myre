import { JWT_PAYLOAD, random } from '~libs/common';
import { LoginDto, RegistrationDto } from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';
import { User } from '~/iam/domain/user/user';

export const USER: Omit<User, 'setPassword' | 'comperePassword'> = {
	email: JWT_PAYLOAD.email,
	username: JWT_PAYLOAD.username,
	password: '123123',
	passwordUpdatedAt: null,
};

export const USER_MODEL: UserModel = {
	id: JWT_PAYLOAD.id,
	...USER,
	password: '$2a$13$kk2.WnMMchuXJEETn1dak.fQDgjLMu.3mO44dGv50C5qx1/oP.9wa',
};

export const CREATE_USER_DTO = (): RegistrationDto => ({
	email: `new_${random()}@test.com`,
	username: `new_new_${random()}`,
	password: USER.password,
});

export const LOGIN_USER_DTO: LoginDto = {
	userIdentifier: USER.username,
	password: USER.password,
};
