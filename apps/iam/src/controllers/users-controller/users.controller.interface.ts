import { Router } from 'express';

import { TController } from '~libs/express-core';

import { ChangeEmailDto } from '~/iam/dto/users/change-email.dto';
import { ChangePasswordDto } from '~/iam/dto/users/change-password.dto';
import { ChangeUsernameDto } from '~/iam/dto/users/change-username.dto';
import { UsersLoginDto } from '~/iam/dto/users/users-login.dto';
import { UsersRegisterDto } from '~/iam/dto/users/users-register.dto';

export interface IUsersController {
	router: Router;

	login: TController<null, UsersLoginDto>;
	register: TController<null, UsersRegisterDto>;
	logout: TController;

	getUserInfo: TController;

	changePassword: TController<null, ChangePasswordDto>;
	changeEmail: TController<null, ChangeEmailDto>;
	changeUsername: TController<null, ChangeUsernameDto>;
}
