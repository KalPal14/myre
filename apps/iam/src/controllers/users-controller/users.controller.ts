import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import {
	HTTPError,
	RouteGuard,
	ValidateMiddleware,
	IJwtService,
	TController,
	BaseController,
} from '~libs/express-core';
import { hideEmail, TEmail } from '~libs/common';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	LoginDto,
	RegistrationDto,
} from '~libs/dto/iam';
import { USERS_ENDPOINTS } from '~libs/routes/iam';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersService } from '~/iam/services/users-service/users.service.interface';

import IUserInfo from './types/user-info.interface';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.UsersService) private usersService: IUsersService,
		@inject(TYPES.JwtService) private jwtService: IJwtService
	) {
		super();
		this.bindRoutes([
			{
				path: USERS_ENDPOINTS.getUserInfo,
				method: 'get',
				func: this.getUserInfo,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: USERS_ENDPOINTS.login,
				method: 'post',
				func: this.login,
				middlewares: [new RouteGuard('guest'), new ValidateMiddleware(LoginDto)],
			},
			{
				path: USERS_ENDPOINTS.register,
				method: 'post',
				func: this.register,
				middlewares: [new RouteGuard('guest'), new ValidateMiddleware(RegistrationDto)],
			},
			{
				path: USERS_ENDPOINTS.logout,
				method: 'post',
				func: this.logout,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: USERS_ENDPOINTS.changePassword,
				method: 'patch',
				func: this.changePassword,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(ChangePasswordDto)],
			},
			{
				path: USERS_ENDPOINTS.changeEmail,
				method: 'patch',
				func: this.changeEmail,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(ChangeEmailDto)],
			},
			{
				path: USERS_ENDPOINTS.changeUsername,
				method: 'patch',
				func: this.changeUsername,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(ChangeUsernameDto)],
			},
		]);
	}

	getUserInfo: TController = async ({ user }, res) => {
		const result = await this.usersService.get(user.id);
		this.ok(res, this.layoutUserInfoRes(result));
	};

	login: TController<null, LoginDto> = async ({ body }, res) => {
		const result = await this.usersService.validate(body);
		this.jwtService
			.generate(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					...this.layoutUserInfoRes(result),
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	register: TController<null, RegistrationDto> = async ({ body }, res) => {
		const result = await this.usersService.create(body);
		this.jwtService
			.generate(result.user)
			.then((jwt) => {
				this.created(res, {
					jwt,
					user: this.layoutUserInfoRes(result.user),
					workspace: result.workspace,
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	logout: TController = async (req, res, next) => {
		try {
			res.clearCookie('token');
			this.ok(res, {
				msg: 'You have successfully logged out',
			});
		} catch {
			next(new HTTPError(500, 'Failed to log out'));
		}
	};

	changePassword: TController<null, ChangePasswordDto> = async ({ user, body }, res) => {
		const result = await this.usersService.changePassword(user, body);
		this.ok(res, {
			passwordUpdatedAt: result.passwordUpdatedAt,
		});
	};

	changeEmail: TController<null, ChangeEmailDto> = async ({ user, body }, res) => {
		const result = await this.usersService.changeEmail(user, body);
		this.jwtService
			.generate(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					email: result.email,
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	changeUsername: TController<null, ChangeUsernameDto> = async ({ user, body }, res) => {
		const result = await this.usersService.changeUsername(user, body);
		this.jwtService
			.generate(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					username: result.username,
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	private layoutUserInfoRes(user: UserModel): IUserInfo {
		return {
			id: user.id,
			email: hideEmail(user.email as TEmail),
			username: user.username,
			passwordUpdatedAt: user.passwordUpdatedAt,
		};
	}
}
