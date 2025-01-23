import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { LANGUAGES_URLS } from '~libs/routes/freq-words';

import { AppModule } from '~/freq-words/app.module';
import {
	ENGLISH_LANGUAGE_ENTITY,
	URKAINIAN_LANGUAGE_ENTITY,
} from '~/freq-words/resources/languages/stubs/languages';

describe('Languages (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe('get many', () => {
		describe(`do not pass parameter q`, () => {
			it('should return all languages', async () => {
				const resp = await request(app.getHttpServer()).get(LANGUAGES_URLS.getMany);

				expect(resp.status).toBe(200);
				expect(Array.isArray(resp.body)).toBe(true);
				expect(resp.body.length).toBeGreaterThan(1);
				expect(resp.body).toEqual(
					expect.arrayContaining([ENGLISH_LANGUAGE_ENTITY, URKAINIAN_LANGUAGE_ENTITY])
				);
			});
		});

		describe(`pass parameter q`, () => {
			it('should return filtered languages based on query', async () => {
				const resp = await request(app.getHttpServer())
					.get(LANGUAGES_URLS.getMany)
					.query({ q: 'Eng' });

				expect(resp.status).toBe(200);
				expect(Array.isArray(resp.body)).toBe(true);
				expect(resp.body).toEqual(expect.arrayContaining([ENGLISH_LANGUAGE_ENTITY]));
				expect(resp.body).not.toEqual(expect.arrayContaining([URKAINIAN_LANGUAGE_ENTITY]));
			});
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing language`, () => {
			it('should return a language by id', async () => {
				const resp = await request(app.getHttpServer()).get(LANGUAGES_URLS.get(1));

				expect(resp.status).toBe(200);
				expect(resp.body).toEqual(ENGLISH_LANGUAGE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing language`, () => {
			it('should return err', async () => {
				const resp = await request(app.getHttpServer()).get(LANGUAGES_URLS.get(999));

				expect(resp.status).toBe(404);
				expect(resp.body).toEqual({ err: `Language #999 not found` });
			});
		});
	});
});
