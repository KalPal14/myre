import { IJwtPayload } from '~libs/express-core';

import { UserModel } from '~/iam/prisma/client';
import { ChangeEmailDto } from '~/iam/dto/users/change-email.dto';
import { ChangePasswordDto } from '~/iam/dto/users/change-password.dto';
import { ChangeUsernameDto } from '~/iam/dto/users/change-username.dto';
import { UsersLoginDto } from '~/iam/dto/users/users-login.dto';
import { UsersRegisterDto } from '~/iam/dto/users/users-register.dto';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
	validateUser: (user: UsersLoginDto) => Promise<UserModel | Error>;

	getUserInfo: (id: number) => Promise<UserModel | null>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel | Error>;
	changeEmail: (user: IJwtPayload, payload: ChangeEmailDto) => Promise<UserModel | Error>;
	changeUsername: (user: IJwtPayload, payload: ChangeUsernameDto) => Promise<UserModel | Error>;
}
