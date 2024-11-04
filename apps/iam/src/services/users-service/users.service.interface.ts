import { IJwtPayload } from '~libs/common';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	LoginDto,
	RegistrationDto,
} from '~libs/dto/iam';
import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	get: (id: number) => Promise<UserModel>;
	create: (
		registerDto: RegistrationDto
	) => Promise<{ user: UserModel; workspace: ICreateWorkspaceRo }>;
	validate: (loginDto: LoginDto) => Promise<UserModel>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel>;
	changeEmail: (user: IJwtPayload, payload: ChangeEmailDto) => Promise<UserModel>;
	changeUsername: (user: IJwtPayload, payload: ChangeUsernameDto) => Promise<UserModel>;
}
