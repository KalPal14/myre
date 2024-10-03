import { Router } from 'express';

import { TController } from '~libs/express-core';

import { ChangeEmailDto } from '~/highlight-extension/dto/users/change-email.dto';
import { ChangePasswordDto } from '~/highlight-extension/dto/users/change-password.dto';
import { ChangeUsernameDto } from '~/highlight-extension/dto/users/change-username.dto';
import { UpdateUserDto } from '~/highlight-extension/dto/users/update-user.dto';
import { UsersLoginDto } from '~/highlight-extension/dto/users/users-login.dto';
import { UsersRegisterDto } from '~/highlight-extension/dto/users/users-register.dto';

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
