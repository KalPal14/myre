import { IJwtPayload } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
	validateUser: (user: UsersLoginDto) => Promise<UserModel | Error>;

	getUserInfo: (id: number) => Promise<UserModel | null>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel | Error>;
	changeEmail: (user: IJwtPayload, payload: ChangeEmailDto) => Promise<UserModel | Error>;
	changeUsername: (user: IJwtPayload, payload: ChangeUsernameDto) => Promise<UserModel | Error>;
}
