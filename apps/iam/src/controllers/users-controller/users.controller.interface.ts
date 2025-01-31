import { Router } from 'express';

import { TController } from '~libs/express-core';
import { LoginDto, RegistrationDto, UpdateUserDto } from '~libs/dto/iam';

export interface IUsersController {
	router: Router;

	getUserInfo: TController;

	login: TController<null, LoginDto>;
	register: TController<null, RegistrationDto>;
	logout: TController;

	update: TController<null, UpdateUserDto>;
}
