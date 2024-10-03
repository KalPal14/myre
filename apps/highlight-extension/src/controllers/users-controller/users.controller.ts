import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import {
	IConfigService,
	HTTPError,
	IJwtPayload,
	RouteGuard,
	TController,
	BaseController,
	ValidateMiddleware,
} from '~libs/express-core';

import { UserModel } from '~/highlight-extension/prisma/client';
import { USERS_PATH } from '~/highlight-extension/common/constants/routes/users';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { TEmail } from '~/highlight-extension/common/types/email.type';
import { ChangeEmailDto } from '~/highlight-extension/dto/users/change-email.dto';
import { ChangePasswordDto } from '~/highlight-extension/dto/users/change-password.dto';
import { ChangeUsernameDto } from '~/highlight-extension/dto/users/change-username.dto';
import { UpdateUserDto } from '~/highlight-extension/dto/users/update-user.dto';
import { UsersLoginDto } from '~/highlight-extension/dto/users/users-login.dto';
import { UsersRegisterDto } from '~/highlight-extension/dto/users/users-register.dto';
import { IUsersService } from '~/highlight-extension/services/users-service/users.service.interface';
import { hideEmail } from '~/highlight-extension/utils/helper-functions/hide-email/hide-email.helper';

import IUserInfo from './types/user-info.interface';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.UsersService) private usersService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super();
		this.bindRoutes([
			{
				path: USERS_PATH.login,
				method: 'post',
				func: this.login,
				middlewares: [new RouteGuard('guest'), new ValidateMiddleware(UsersLoginDto)],
			},
			{
				path: USERS_PATH.register,
				method: 'post',
				func: this.register,
				middlewares: [new RouteGuard('guest'), new ValidateMiddleware(UsersRegisterDto)],
			},
			{
				path: USERS_PATH.logout,
				method: 'post',
				func: this.logout,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: USERS_PATH.updateUser,
				method: 'patch',
				func: this.updateUser,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdateUserDto)],
			},
			{
				path: USERS_PATH.changePassword,
				method: 'patch',
				func: this.changePassword,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(ChangePasswordDto)],
			},
			{
				path: USERS_PATH.changeEmail,
				method: 'patch',
				func: this.changeEmail,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(ChangeEmailDto)],
			},
			{
				path: USERS_PATH.changeUsername,
				method: 'patch',
				func: this.changeUsername,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(ChangeUsernameDto)],
			},
			{
				path: USERS_PATH.getUserInfo,
				method: 'get',
				func: this.getUserInfo,
				middlewares: [new RouteGuard('user')],
			},
		]);
	}

	private layoutUserInfoRes(user: UserModel): IUserInfo {
		return {
			id: user.id,
			email: hideEmail(user.email as TEmail),
			username: user.username,
			passwordUpdatedAt: user.passwordUpdatedAt,
			colors: user.colors.map((color) => ({
				color,
			})),
		};
	}

	getUserInfo: TController = async ({ user }, res, next) => {
		const result = await this.usersService.getUserInfo(user.id);

		if (!result) {
			return next(new HTTPError(404, 'User information not found'));
		}

		this.ok(res, this.layoutUserInfoRes(result));
	};

	updateUser: TController<null, UpdateUserDto> = async ({ body, user }, res, next) => {
		if (!Object.keys(body).length) {
			return next(new HTTPError(422, 'User change data is empty'));
		}

		const result = await this.usersService.updateUser(Number(user.id), body);

		this.ok(res, this.layoutUserInfoRes(result));
	};

	login: TController<null, UsersLoginDto> = async ({ body }, res, next) => {
		const result = await this.usersService.validateUser(body);

		if (result instanceof Error) {
			next(result);
			return;
		}

		this.generateJwt(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					...this.layoutUserInfoRes(result),
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	register: TController<null, UsersRegisterDto> = async ({ body }, res, next) => {
		const result = await this.usersService.createUser(body);

		if (result instanceof Error) {
			next(result);
			return;
		}

		this.generateJwt(result)
			.then((jwt) => {
				this.created(res, {
					jwt,
					...this.layoutUserInfoRes(result),
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

	changePassword: TController<null, ChangePasswordDto> = async ({ user, body }, res, next) => {
		const result = await this.usersService.changePassword(user, body);

		if (result instanceof Error) {
			if (result.message === 'Incorrect password') {
				next(new HTTPError(422, 'The current password is incorrect'));
				return;
			}
			next(new HTTPError(422, result.message));
			return;
		}

		this.ok(res, {
			passwordUpdatedAt: result.passwordUpdatedAt,
		});
	};

	changeEmail: TController<null, ChangeEmailDto> = async ({ user, body }, res, next) => {
		const result = await this.usersService.changeEmail(user, body);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.generateJwt(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					email: result.email,
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	changeUsername: TController<null, ChangeUsernameDto> = async ({ user, body }, res, next) => {
		const result = await this.usersService.changeUsername(user, body);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.generateJwt(result)
			.then((jwt) => {
				this.ok(res, {
					jwt,
					username: result.username,
				});
			})
			.catch((err) => this.send(res, 500, { err }));
	};

	private async generateJwt({ id, email, username }: IJwtPayload): Promise<string> {
		return new Promise((resolve, reject) => {
			const jwtKey = this.configService.get('JWT_KEY');

			sign(
				{ id, email, username },
				jwtKey,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err.message);
					} else {
						resolve(token as string);
					}
				}
			);
		});
	}
}
