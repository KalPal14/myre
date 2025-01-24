import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { SOURCES_URLS } from '~libs/routes/freq-words';
import { USERS_URLS } from '~libs/routes/iam';
import { GetSourcesDto, UpdateSourceDto } from '~libs/dto/freq-words';

import { bootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/stubs/users';
import { AppModule } from '~/freq-words/app.module';
import {
	GET_OR_CREATE_SOURCE_DTO,
	SOURCE_ENTITY,
} from '~/freq-words/resources/source/stubs/sources';
import { WORKSPACE_ENTITY } from '~/freq-words/resources/workspaces/stubs/workspaces';
import { WORD_FORM_MARK_ENTITY } from '~/freq-words/resources/word-marks/stubs/word-form-marks';
import { WORD_FORM_ENTITY } from '~/freq-words/resources/word-forms/stubs/word-forms';

describe('Sources (e2e)', () => {
	let app: INestApplication;
	let jwt: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { app: iamApp } = await bootstrap();
		const loginRes = await request(iamApp).post(USERS_URLS.login).send(LOGIN_USER_DTO);
		jwt = loginRes.body.jwt;
	});

	afterAll(async () => {
		await app.close();
	});

	describe('get or create', () => {
		describe('unauthorised user', () => {
			it('return unauthorized error', async () => {
				const dto = GET_OR_CREATE_SOURCE_DTO(true);

				const resp = await request(app.getHttpServer()).post(SOURCES_URLS.getOrCreate).send(dto);

				expect(resp.statusCode).toBe(403);
			});
		});

		describe(`pass data of an existing source`, () => {
			it('should return an existing source', async () => {
				const dto = GET_OR_CREATE_SOURCE_DTO(true);

				const resp = await request(app.getHttpServer())
					.post(SOURCES_URLS.getOrCreate)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual(
					expect.objectContaining({ id: SOURCE_ENTITY.id, link: SOURCE_ENTITY.link })
				);
			});
		});

		describe(`pass data of non-existing source`, () => {
			it('should create new source and return it', async () => {
				const dto = GET_OR_CREATE_SOURCE_DTO();

				const resp = await request(app.getHttpServer())
					.post(SOURCES_URLS.getOrCreate)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body.id).toBeDefined();
				expect(resp.body).toEqual(
					expect.objectContaining({
						link: dto.link,
						workspace: WORKSPACE_ENTITY,
						wordFormMarks: [],
					})
				);
			});
		});
	});

	describe('get many', () => {
		it('should return all sources for a workspace', async () => {
			const dto: GetSourcesDto = { workspaceId: WORKSPACE_ENTITY.id };

			const resp = await request(app.getHttpServer())
				.get(SOURCES_URLS.getMany)
				.set('Authorization', `Bearer ${jwt}`)
				.query(dto);

			expect(resp.status).toBe(HttpStatus.OK);
			expect(Array.isArray(resp.body)).toBe(true);
			expect(resp.body).toEqual(
				expect.arrayContaining([{ id: SOURCE_ENTITY.id, link: SOURCE_ENTITY.link }])
			);
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing source`, () => {
			it('should return a source by id', async () => {
				const resp = await request(app.getHttpServer())
					.get(SOURCES_URLS.get(SOURCE_ENTITY.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual({
					...SOURCE_ENTITY,
					wordFormMarks: [
						{
							...WORD_FORM_MARK_ENTITY,
							sources: [{ id: SOURCE_ENTITY.id, link: SOURCE_ENTITY.link }],
							wordForm: { id: WORD_FORM_ENTITY.id, name: WORD_FORM_ENTITY.name },
							wordMark: undefined,
						},
					],
					workspace: WORKSPACE_ENTITY,
				});
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should return err msg', async () => {
				const resp = await request(app.getHttpServer())
					.get(SOURCES_URLS.get(-1))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `Source #${-1} not found` });
			});
		});
	});

	describe('update', () => {
		const dto: UpdateSourceDto = { link: `${SOURCE_ENTITY.link}/updated` };

		describe(`pass the id of an existing source`, () => {
			it('should update and return the source', async () => {
				const { body: createdSource } = await request(app.getHttpServer())
					.post(SOURCES_URLS.getOrCreate)
					.set('Authorization', `Bearer ${jwt}`)
					.send(GET_OR_CREATE_SOURCE_DTO());

				const resp = await request(app.getHttpServer())
					.patch(SOURCES_URLS.update(createdSource.id))
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual({
					...createdSource,
					link: dto.link,
					wordFormMarks: [],
					workspace: WORKSPACE_ENTITY,
				});
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should return err msg', async () => {
				const resp = await request(app.getHttpServer())
					.patch(SOURCES_URLS.update(-1))
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `Source #${-1} not found` });
			});
		});
	});

	describe('delete', () => {
		describe(`pass the id of an existing source`, () => {
			it('should delete and return the source', async () => {
				const { body: createdSource } = await request(app.getHttpServer())
					.post(SOURCES_URLS.getOrCreate)
					.set('Authorization', `Bearer ${jwt}`)
					.send(GET_OR_CREATE_SOURCE_DTO());

				const resp = await request(app.getHttpServer())
					.delete(SOURCES_URLS.delete(createdSource.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual({
					...createdSource,
					wordFormMarks: [],
					workspace: WORKSPACE_ENTITY,
				});
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should return err msg', async () => {
				const resp = await request(app.getHttpServer())
					.delete(SOURCES_URLS.delete(-1))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `Source #${-1} not found` });
			});
		});
	});
});
