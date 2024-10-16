import 'reflect-metadata';
import request from 'supertest';

import { hideEmail } from '~libs/common';

import { bootstrap } from '~/iam/main';
import App from '~/iam/app';
import {
	RIGHT_USER,
	WRONG_USER,
	INVALID_USER,
	GET_NEW_USER,
	GET_UPDATED_USER,
	UPDATED_USER,
} from '~/iam/common/constants/spec/users';
import { USERS_FULL_PATH } from '~/iam/common/constants/routes/users';

let application: App;

beforeAll(async () => {
	application = await bootstrap('test');
});

describe('Users', () => {
	it('Registration - wrong: user already exists', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: RIGHT_USER.email,
			username: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Registration - wrong: invalid request body', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: RIGHT_USER.email,
			username: INVALID_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - success: by email', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.email,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});

	it('Login - success: by username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).toBeDefined();
	});

	it('Login - wrong: invalid email', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: WRONG_USER.email,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: invalid username', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: WRONG_USER.username,
			password: RIGHT_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: invalid password', async () => {
		const res = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: WRONG_USER.password,
		});

		expect(res.statusCode).toBe(422);
	});

	it('Login - wrong: user is already logged in', async () => {
		const resFirstLogin = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});
		const res = await request(application.app)
			.post(USERS_FULL_PATH.login)
			.set('Authorization', `Bearer ${resFirstLogin.body.jwt}`)
			.send({
				userIdentifier: RIGHT_USER.username,
				password: RIGHT_USER.password,
			});

		expect(res.statusCode).toBe(401);
	});

	it('Logout - success', async () => {
		const loginRes = await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		const res = await request(application.app)
			.post(USERS_FULL_PATH.logout)
			.set('Authorization', `Bearer ${loginRes.body.jwt}`);

		expect(res.statusCode).toBe(200);
	});

	it('Logout - wrong: user is not authorized', async () => {
		await request(application.app).post(USERS_FULL_PATH.login).send({
			userIdentifier: RIGHT_USER.username,
			password: RIGHT_USER.password,
		});

		const res = await request(application.app).post(USERS_FULL_PATH.logout);

		expect(res.statusCode).toBe(401);
	});

	it('Change password - success', async () => {
		const NEW_USER = GET_NEW_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});
		const res = await request(application.app)
			.patch(USERS_FULL_PATH.changePassword)
			.set('Authorization', `Bearer ${regRes.body.jwt}`)
			.send({
				password: NEW_USER.password,
				newPassword: UPDATED_USER.password,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.passwordUpdatedAt).toBeDefined();
	}, 6000);

	it('Change email - success', async () => {
		const NEW_USER = GET_NEW_USER();
		const UPDATED_USER = GET_UPDATED_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});

		const res = await request(application.app)
			.patch(USERS_FULL_PATH.changeEmail)
			.set('Authorization', `Bearer ${regRes.body.jwt}`)
			.send({
				newEmail: UPDATED_USER.email,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBe(regRes.body.jwt);
		expect(res.body.email).not.toBe(regRes.body.email);
		expect(res.body.email).toBe(UPDATED_USER.email);
	});

	it('Change username - success', async () => {
		const NEW_USER = GET_NEW_USER();
		const UPDATED_USER = GET_UPDATED_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});

		const res = await request(application.app)
			.patch(USERS_FULL_PATH.changeUsername)
			.set('Authorization', `Bearer ${regRes.body.jwt}`)
			.send({
				newUsername: UPDATED_USER.username,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBe(regRes.body.jwt);
		expect(res.body.username).not.toBe(regRes.body.username);
		expect(res.body.username).toBe(UPDATED_USER.username);
	});

	it('Get User Info - success', async () => {
		const NEW_USER = GET_NEW_USER();
		const regRes = await request(application.app).post(USERS_FULL_PATH.register).send({
			email: NEW_USER.email,
			username: NEW_USER.username,
			password: NEW_USER.password,
		});

		const res = await request(application.app)
			.get(USERS_FULL_PATH.getUserInfo)
			.set('Authorization', `Bearer ${regRes.body.jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: regRes.body.id,
			email: hideEmail(regRes.body.email),
			username: regRes.body.username,
			passwordUpdatedAt: NEW_USER.passwordUpdatedAt,
		});
	});
});
