import { IJwtPayload } from '~libs/common';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/iam';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	get: (id: number) => Promise<UserModel>;
	create: (registerDto: UsersRegisterDto) => Promise<UserModel>;
	validate: (loginDto: UsersLoginDto) => Promise<UserModel>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel>;
	changeEmail: (user: IJwtPayload, payload: ChangeEmailDto) => Promise<UserModel>;
	changeUsername: (user: IJwtPayload, payload: ChangeUsernameDto) => Promise<UserModel>;
}
