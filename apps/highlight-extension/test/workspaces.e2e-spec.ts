import 'reflect-metadata';
import request from 'supertest';

import { UpdateWorkspaceDto } from '~libs/dto/highlight-extension';

import { bootstrap } from '~/highlight-extension/main';
import { WORKSPACES_URLS } from '~/highlight-extension/common/constants/routes/workspaces';
import {
	CREATE_WORKSPACE_DTO,
	WORKSPACE_MODEL,
} from '~/highlight-extension/common/constants/spec/workspaces';
import { USERS_URLS } from '~/iam/common/constants/routes/users';
import { bootstrap as iamBootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/constants/spec/users';

import type { Express } from 'express';

let app: Express;
let jwt: string;

beforeAll(async () => {
	const application = await bootstrap('test');
	app = application.app;

	const { app: iamApp } = await iamBootstrap('test');

	const loginRes = await request(iamApp).post(USERS_URLS.login).send(LOGIN_USER_DTO);
	jwt = loginRes.body.jwt;
});

describe('Workspaces', () => {
	describe('get workspace', () => {
		describe('pass existing workspace ID', () => {
			it('return workspace', async () => {
				const res = await request(app)
					.get(WORKSPACES_URLS.get(WORKSPACE_MODEL.id))
					.set('Authorization', `Bearer ${jwt}`);

				const { pages, ...restWorkspace } = res.body;
				expect(res.statusCode).toBe(200);
				expect(restWorkspace).toEqual(WORKSPACE_MODEL);
				expect(pages).toHaveProperty('length');
			});
		});

		describe('pass ID of non-existing workspace', () => {
			it('return err message', async () => {
				const id = -1;

				const res = await request(app)
					.get(WORKSPACES_URLS.get(id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(404);
				expect(res.body).toEqual({ err: `workspace #${id} not found` });
			});
		});
	});

	describe('get all workspaces owned by the user', () => {
		describe('logged in user', () => {
			it('return list of workspaces', async () => {
				const res = await request(app)
					.get(WORKSPACES_URLS.getAllOwners)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toHaveProperty('length');
				expect(res.body[0]).toEqual(WORKSPACE_MODEL);
			});
		});
	});

	describe('create workspace', () => {
		describe('pass correct DTO', () => {
			it('return created workspace', async () => {
				const res = await request(app)
					.post(WORKSPACES_URLS.create)
					.send(CREATE_WORKSPACE_DTO)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body.id).toBeDefined();
				expect(res.body.name).toBe(CREATE_WORKSPACE_DTO.name);
				expect(res.body.colors).toEqual(CREATE_WORKSPACE_DTO.colors);
			});
		});

		describe('pass incorrect DTO', () => {
			const INCORRECT_DTO = { name: 'new W' };

			it('return err message', async () => {
				const res = await request(app)
					.post(WORKSPACES_URLS.create)
					.send(INCORRECT_DTO)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(422);
				expect(res.body[0]).toEqual({
					property: 'colors',
					value: 'undefined',
					errors: ['This field must contain an array of colors in rgb or hex format'],
				});
			});
		});
	});

	describe('update workspace', () => {
		const UPDATE_DTO: UpdateWorkspaceDto = { name: 'updated' };

		describe('pass the existing workspace ID ', () => {
			it('return updated workspace', async () => {
				const createRes = await request(app)
					.post(WORKSPACES_URLS.create)
					.send(CREATE_WORKSPACE_DTO)
					.set('Authorization', `Bearer ${jwt}`);

				const res = await request(app)
					.patch(WORKSPACES_URLS.update(createRes.body.id))
					.send(UPDATE_DTO)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({ ...createRes.body, ...UPDATE_DTO });
			});
		});

		describe('pass the ID of a non-existing workspace', () => {
			it('return err message', async () => {
				const id = -1;

				const res = await request(app)
					.patch(WORKSPACES_URLS.update(id))
					.send(UPDATE_DTO)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(404);
				expect(res.body).toEqual({ err: `workspace #${id} not found` });
			});
		});
	});

	describe('delete workspace', () => {
		describe('pass the existing workspace ID ', () => {
			it('return deleted workspace', async () => {
				const createRes = await request(app)
					.post(WORKSPACES_URLS.create)
					.send(CREATE_WORKSPACE_DTO)
					.set('Authorization', `Bearer ${jwt}`);

				const res = await request(app)
					.delete(WORKSPACES_URLS.delete(createRes.body.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({ ...createRes.body });
			});
		});

		describe('pass the ID of a non-existing workspace', () => {
			it('throw an error', async () => {
				const id = -1;

				const res = await request(app)
					.delete(WORKSPACES_URLS.delete(id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(404);
				expect(res.body).toEqual({ err: `workspace #${id} not found` });
			});
		});
	});
});
