import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import {
	RoleGuard,
	ValidateMiddleware,
	IJwtService,
	TController,
	BaseController,
} from '~libs/express-core';
import { hideEmailUsername, HTTPError } from '~libs/common';
import { LoginDto, RegistrationDto, UpdateUserDto, UserExistenceCheckDto } from '~libs/dto/iam';
import { USERS_ENDPOINTS } from '~libs/routes/iam';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersService } from '~/iam/services/users-service/users.service.interface';

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
			},
			{
				path: USERS_ENDPOINTS.exictanceCheck,
				method: 'get',
				func: this.exictanceCheck,
				middlewares: [new RoleGuard('*'), new ValidateMiddleware(UserExistenceCheckDto, 'query')],
			},
			{
				path: USERS_ENDPOINTS.login,
				method: 'post',
				func: this.login,
				middlewares: [new RoleGuard('guest'), new ValidateMiddleware(LoginDto)],
			},
			{
				path: USERS_ENDPOINTS.register,
				method: 'post',
				func: this.register,
				middlewares: [new RoleGuard('guest'), new ValidateMiddleware(RegistrationDto)],
			},
			{
				path: USERS_ENDPOINTS.logout,
				method: 'post',
				func: this.logout,
			},
			{
				path: USERS_ENDPOINTS.update,
				method: 'patch',
				func: this.update,
				middlewares: [new ValidateMiddleware(UpdateUserDto)],
			},
		]);
	}

	getUserInfo: TController = async ({ user }, res) => {
		const result = await this.usersService.get(user.id);
		this.ok(res, this.layoutUserInfoRes(result));
	};

	exictanceCheck: TController<null, null, UserExistenceCheckDto> = async ({ query }, res) => {
		const result = await this.usersService.find(query);
		this.ok(res, Boolean(result));
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
			.generate(result)
			.then((jwt) => {
				this.created(res, {
					...result,
					jwt,
					user: this.layoutUserInfoRes(result),
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

	update: TController<null, UpdateUserDto> = async ({ user, body }, res) => {
		const result = await this.usersService.update(user, body);

		if (body.username || body.email) {
			this.jwtService
				.generate(result)
				.then((jwt) => {
					this.ok(res, {
						jwt,
						...this.layoutUserInfoRes(result),
					});
				})
				.catch((err) => this.send(res, 500, { err }));
		} else {
			this.ok(res, this.layoutUserInfoRes(result));
		}
	};

	private layoutUserInfoRes(user: UserModel): Omit<UserModel, 'password'> {
		const { password: _, ...userInfo } = user;
		return {
			...userInfo,
			email: hideEmailUsername(user.email),
		};
	}
}
