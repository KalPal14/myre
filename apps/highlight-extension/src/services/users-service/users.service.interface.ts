import { IJwtPayload } from '~libs/express-core';

import { UserModel } from '~/highlight-extension/prisma/client';
import { ChangeEmailDto } from '~/highlight-extension/dto/users/change-email.dto';
import { ChangePasswordDto } from '~/highlight-extension/dto/users/change-password.dto';
import { ChangeUsernameDto } from '~/highlight-extension/dto/users/change-username.dto';
import { UpdateUserDto } from '~/highlight-extension/dto/users/update-user.dto';
import { UsersLoginDto } from '~/highlight-extension/dto/users/users-login.dto';
import { UsersRegisterDto } from '~/highlight-extension/dto/users/users-register.dto';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
	validateUser: (user: UsersLoginDto) => Promise<UserModel | Error>;
	updateUser: (id: number, payload: UpdateUserDto) => Promise<UserModel>;

	getUserInfo: (id: number) => Promise<UserModel | null>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel | Error>;
	changeEmail: (user: IJwtPayload, payload: ChangeEmailDto) => Promise<UserModel | Error>;
	changeUsername: (user: IJwtPayload, payload: ChangeUsernameDto) => Promise<UserModel | Error>;
}
