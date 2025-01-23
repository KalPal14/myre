import 'reflect-metadata';
import request from 'supertest';

import { configEnv } from '~libs/express-core/config';
import {
	ChangeEmailDto,
	ChangePasswordDto,
	ChangeUsernameDto,
	LoginDto,
	RegistrationDto,
} from '~libs/dto/iam';
import { hideEmailUsername } from '~libs/common';
import { USERS_URLS } from '~libs/routes/iam';

import { bootstrap } from '~/iam/main';
import { bootstrap as hExtBootstrap } from '~/highlight-extension/main';
import { CREATE_USER_DTO, LOGIN_USER_DTO, USER, USER_MODEL } from '~/iam/common/stubs/users';

import type { Express } from 'express';

configEnv();

let app: Express;
let hExtApp: Express;

jest.mock('~libs/common', () => ({
	...jest.requireActual('~libs/common'),
	api: {
		post: jest.fn().mockImplementation(async (url, data, options) => {
			const resp = await request(hExtApp)
				.post(url)
				.set(options?.headers || {})
				.send(data);
			return resp.body;
		}),
	},
}));

beforeAll(async () => {
	const application = await bootstrap();
	const hExtApplication = await hExtBootstrap();
	app = application.app;

	hExtApp = hExtApplication.app;
});

describe('Users', () => {
	describe('registration', () => {
		describe('pass new email and username', () => {
			it('return jwt token and created user and workspace', async () => {
				const DTO = CREATE_USER_DTO();

				const res = await request(app).post(USERS_URLS.register).send(DTO);

				expect(res.statusCode).toBe(201);
				expect(res.body.jwt).toBeDefined();
				expect(res.body).toMatchObject({
					user: {
						username: DTO.username,
						email: hideEmailUsername(DTO.email),
					},
					workspace: {
						name: `${DTO.username}'s workspace`,
						colors: [],
					},
				});
			});
		});

		describe('pass email address of existing user', () => {
			it('return error message', async () => {
				const DTO: RegistrationDto = {
					email: USER.email,
					username: USER.username,
					password: USER.password,
				};

				const res = await request(app).post(USERS_URLS.register).send(DTO);

				expect(res.statusCode).toBe(400);
				expect(res.body).toEqual({ err: 'user with this email already exists' });
			});
		});

		describe('pass invalid username format', () => {
			it('return dto validation error message', async () => {
				const DTO: RegistrationDto = {
					email: USER.email,
					username: 'username+',
					password: USER.password,
				};

				const res = await request(app).post(USERS_URLS.register).send(DTO);

				expect(res.statusCode).toBe(400);
				expect(res.body).toEqual([
					{
						property: 'username',
						errors: [
							'The username field must contain only uppercase and lowercase letters, as well as the symbols - and _.',
						],
					},
				]);
			});
		});
	});

	describe('login', () => {
		describe('pass correct email and password', () => {
			it('return jwt token and user info', async () => {
				const LOGIN_DTO: LoginDto = {
					userIdentifier: USER.email,
					password: USER.password,
				};

				const res = await request(app).post(USERS_URLS.login).send(LOGIN_DTO);

				const { jwt, ...userInfo } = res.body;
				expect(res.statusCode).toBe(200);
				expect(jwt).toBeDefined();
				expect(userInfo).toEqual({
					id: USER_MODEL.id,
					email: hideEmailUsername(USER_MODEL.email),
					username: USER_MODEL.username,
					passwordUpdatedAt: USER_MODEL.passwordUpdatedAt,
				});
			});
		});

		describe('pass correct username and password', () => {
			it('return jwt token and user info', async () => {
				const res = await request(app).post(USERS_URLS.login).send(LOGIN_USER_DTO);

				const { jwt, ...userInfo } = res.body;
				expect(res.statusCode).toBe(200);
				expect(jwt).toBeDefined();
				expect(userInfo).toEqual({
					id: USER_MODEL.id,
					email: hideEmailUsername(USER_MODEL.email),
					username: USER_MODEL.username,
					passwordUpdatedAt: USER_MODEL.passwordUpdatedAt,
				});
			});
		});

		describe('pass email of unexisting user', () => {
			it('return error message', async () => {
				const NEW_USER = CREATE_USER_DTO();
				const LOGGIN_DTO: LoginDto = {
					userIdentifier: NEW_USER.email,
					password: NEW_USER.password,
				};

				const res = await request(app).post(USERS_URLS.login).send(LOGGIN_DTO);

				expect(res.statusCode).toBe(400);
				expect(res.body).toEqual({ err: 'There is no user with this email' });
			});
		});

		describe('pass username of unexisting user', () => {
			it('return error message', async () => {
				const NEW_USER = CREATE_USER_DTO();
				const LOGIN_DTO: LoginDto = {
					userIdentifier: NEW_USER.username,
					password: NEW_USER.password,
				};

				const res = await request(app).post(USERS_URLS.login).send(LOGIN_DTO);

				expect(res.statusCode).toBe(400);
				expect(res.body).toEqual({ err: 'There is no user with this username' });
			});
		});

		describe('pass wrong password', () => {
			it('return error message', async () => {
				const LOGIN_DTO: LoginDto = {
					userIdentifier: USER.email,
					password: USER.password + '123',
				};

				const res = await request(app).post(USERS_URLS.login).send(LOGIN_DTO);

				expect(res.statusCode).toBe(400);
				expect(res.body).toEqual({ err: 'Incorrect password' });
			});
		});

		describe('already logged in user is trying to log in', () => {
			it('return unauthorised error', async () => {
				const prevLoginRes = await request(app).post(USERS_URLS.login).send(LOGIN_USER_DTO);

				const res = await request(app)
					.post(USERS_URLS.login)
					.set('Authorization', `Bearer ${prevLoginRes.body.jwt}`)
					.send(LOGIN_USER_DTO);

				expect(res.statusCode).toBe(403);
			});
		});
	});

	describe('logout', () => {
		describe('logged in user tries to log out', () => {
			it('return success message', async () => {
				const loginRes = await request(app).post(USERS_URLS.login).send(LOGIN_USER_DTO);

				const res = await request(app)
					.post(USERS_URLS.logout)
					.set('Authorization', `Bearer ${loginRes.body.jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({ msg: 'You have successfully logged out' });
			});
		});

		describe('unlogged user tries to log out', () => {
			it('return unauthorised error', async () => {
				const res = await request(app).post(USERS_URLS.logout);

				expect(res.statusCode).toBe(403);
			});
		});
	});

	describe('change password', () => {
		describe('pass correct new and current passwords', () => {
			const NEW_USER = CREATE_USER_DTO();
			const CHANGE_PASSWORD_DTO: ChangePasswordDto = {
				password: NEW_USER.password,
				newPassword: NEW_USER.password + '123',
			};

			it('return new passwordUpdatedAt', async () => {
				const newUserRes = await request(app).post(USERS_URLS.register).send(NEW_USER);

				const res = await request(app)
					.patch(USERS_URLS.changePassword)
					.set('Authorization', `Bearer ${newUserRes.body.jwt}`)
					.send(CHANGE_PASSWORD_DTO);

				expect(res.statusCode).toBe(200);
				expect(res.body.passwordUpdatedAt).not.toBeNull();
			}, 6000);
		});
	});

	describe('change email', () => {
		describe('pass correct new email', () => {
			it('return new email and jwt token', async () => {
				const NEW_USER = CREATE_USER_DTO();
				const newUserRes = await request(app).post(USERS_URLS.register).send(NEW_USER);
				const CHANGE_EMAIL_DTO: ChangeEmailDto = {
					newEmail: CREATE_USER_DTO().email,
				};

				const res = await request(app)
					.patch(USERS_URLS.changeEmail)
					.set('Authorization', `Bearer ${newUserRes.body.jwt}`)
					.send(CHANGE_EMAIL_DTO);

				expect(res.statusCode).toBe(200);
				expect(res.body.jwt).not.toBe(newUserRes.body.jwt);
				expect(res.body.email).toBe(CHANGE_EMAIL_DTO.newEmail);
			});
		});
	});

	describe('change username', () => {
		describe('pass correct new username', () => {
			it('return new username and jwt token', async () => {
				const NEW_USER = CREATE_USER_DTO();
				const newUserRes = await request(app).post(USERS_URLS.register).send(NEW_USER);
				const CHANGE_USERNAME_DTO: ChangeUsernameDto = {
					newUsername: CREATE_USER_DTO().username,
				};

				const res = await request(app)
					.patch(USERS_URLS.changeUsername)
					.set('Authorization', `Bearer ${newUserRes.body.jwt}`)
					.send(CHANGE_USERNAME_DTO);

				expect(res.statusCode).toBe(200);
				expect(res.body.jwt).not.toBe(newUserRes.body.jwt);
				expect(res.body.username).toBe(CHANGE_USERNAME_DTO.newUsername);
			});
		});
	});

	describe('get user info', () => {
		describe('a logged in user is trying to retrieve their data', () => {
			it('return user info', async () => {
				const loginRes = await request(app).post(USERS_URLS.login).send(LOGIN_USER_DTO);
				const { jwt, ...loggedUserInfo } = loginRes.body;

				const res = await request(app)
					.get(USERS_URLS.getUserInfo)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual(loggedUserInfo);
			});
		});
	});
});
