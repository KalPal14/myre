import { Router } from 'express';

import { TController } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	UsersLoginDto,
	UsersRegisterDto,
} from '~libs/dto/iam';

export interface IUsersController {
	router: Router;

	getUserInfo: TController;

	login: TController<null, UsersLoginDto>;
	register: TController<null, UsersRegisterDto>;
	logout: TController;

	changePassword: TController<null, ChangePasswordDto>;
	changeEmail: TController<null, ChangeEmailDto>;
	changeUsername: TController<null, ChangeUsernameDto>;
}
