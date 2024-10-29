import { Router } from 'express';

import { TController } from '~libs/express-core';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	LoginDto,
	RegistrationDto,
} from '~libs/dto/iam';

export interface IUsersController {
	router: Router;

	getUserInfo: TController;

	login: TController<null, LoginDto>;
	register: TController<null, RegistrationDto>;
	logout: TController;

	changePassword: TController<null, ChangePasswordDto>;
	changeEmail: TController<null, ChangeEmailDto>;
	changeUsername: TController<null, ChangeUsernameDto>;
}
