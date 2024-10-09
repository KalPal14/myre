import { Router } from 'express';

import { TController } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UpdateUserDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/highlight-extension';

export interface IUsersController {
	router: Router;

	login: TController<null, UsersLoginDto>;
	register: TController<null, UsersRegisterDto>;
	logout: TController;

	getUserInfo: TController;

	updateUser: TController<null, UpdateUserDto>;
	changePassword: TController<null, ChangePasswordDto>;
	changeEmail: TController<null, ChangeEmailDto>;
	changeUsername: TController<null, ChangeUsernameDto>;
}
