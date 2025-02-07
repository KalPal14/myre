import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { USERS_URLS } from '~libs/routes/iam';
import { WORKSPACES_URLS } from '~libs/routes/freq-words';
import { JWT_PAYLOAD } from '~libs/common/index';
import { UpdateWorkspaceDto } from '~libs/dto/freq-words';

import { bootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/stubs/users';
import { AppModule } from '~/freq-words/app.module';
import {
	CREATE_WORKSPACE_DTO,
	WORKSPACE_ENTITY,
} from '~/freq-words/resources/workspaces/stubs/workspaces';
import {
	ENGLISH_LANGUAGE_ENTITY,
	RUSSIAN_LANGUAGE_ENTITY,
} from '~/freq-words/resources/languages/stubs/languages';

describe('Workspaces (e2e)', () => {
	let app: INestApplication;
	let jwt: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const {
			app: { app: iamApp },
		} = await bootstrap();
		const loginRes = await request(iamApp).post(USERS_URLS.login).send(LOGIN_USER_DTO);
		jwt = loginRes.body.jwt;
	});

	afterAll(async () => {
		await app.close();
	});

	describe('create', () => {
		describe(`pass new workspace data`, () => {
			it('should create and save a new workspace', async () => {
				const dto = CREATE_WORKSPACE_DTO();

				const resp = await request(app.getHttpServer())
					.post(WORKSPACES_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.CREATED);
				expect(resp.body.id).toBeDefined();
				expect(resp.body).toEqual(
					expect.objectContaining({
						name: dto.name,
						knownLanguage: ENGLISH_LANGUAGE_ENTITY,
						targetLanguage: RUSSIAN_LANGUAGE_ENTITY,
					})
				);
			});
		});

		describe('pass data of already existing workspace', () => {
			it('should return err msg', async () => {
				const dto = CREATE_WORKSPACE_DTO(true);

				const resp = await request(app.getHttpServer())
					.post(WORKSPACES_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.BAD_REQUEST);
				expect(resp.body).toEqual({
					err: `User ${JWT_PAYLOAD.username} already has '${dto.name}' workspace`,
				});
			});
		});
	});

	describe('get many', () => {
		it(`should return all user's workspaces`, async () => {
			const resp = await request(app.getHttpServer())
				.get(WORKSPACES_URLS.getOwnersWorkspaces)
				.set('Authorization', `Bearer ${jwt}`);

			expect(resp.status).toBe(HttpStatus.OK);
			expect(Array.isArray(resp.body)).toBeTruthy();
			expect(resp.body[0]).toEqual(WORKSPACE_ENTITY);
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing workspace`, () => {
			it('should return a workspace by id', async () => {
				const resp = await request(app.getHttpServer())
					.get(WORKSPACES_URLS.get(WORKSPACE_ENTITY.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual(expect.objectContaining(WORKSPACE_ENTITY));
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should return err msg', async () => {
				const resp = await request(app.getHttpServer())
					.get(WORKSPACES_URLS.get(-1))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `Workspace #${-1} not found` });
			});
		});
	});

	describe('update', () => {
		const dto: UpdateWorkspaceDto = { name: 'updated name' };

		describe(`pass the id of an existing workspace`, () => {
			it('should update and return the workspace', async () => {
				const { body: createdWorkspace } = await request(app.getHttpServer())
					.post(WORKSPACES_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_WORKSPACE_DTO());

				const resp = await request(app.getHttpServer())
					.patch(WORKSPACES_URLS.update(createdWorkspace.id))
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual({
					...createdWorkspace,
					name: dto.name,
					knownLanguage: undefined,
					targetLanguage: undefined,
				});
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should err msg', async () => {
				const resp = await request(app.getHttpServer())
					.patch(WORKSPACES_URLS.update(-1))
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `Workspace #${-1} not found` });
			});
		});
	});

	describe('delete', () => {
		describe(`pass the id of an existing workspace`, () => {
			it('should delete and return the workspace', async () => {
				const { body: createdWorkspace } = await request(app.getHttpServer())
					.post(WORKSPACES_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_WORKSPACE_DTO());

				const resp = await request(app.getHttpServer())
					.delete(WORKSPACES_URLS.delete(createdWorkspace.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual(createdWorkspace);
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should return err msg', async () => {
				const resp = await request(app.getHttpServer())
					.delete(WORKSPACES_URLS.delete(-1))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `Workspace #${-1} not found` });
			});
		});
	});
});
