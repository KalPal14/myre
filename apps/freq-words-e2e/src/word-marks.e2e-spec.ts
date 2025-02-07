import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { USERS_URLS } from '~libs/routes/iam';
import { WORD_MARKS_URLS } from '~libs/routes/freq-words';
import { GetWordMarksDto } from '~libs/dto/freq-words';

import { bootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/stubs/users';
import { AppModule } from '~/freq-words/app.module';
import {
	UPSERT_WORD_MARK_DTO,
	WORD_MARK_ENTITY,
} from '~/freq-words/resources/word-marks/stubs/word-marks';
import { WordFormMark } from '~/freq-words/resources/word-marks/entities/word-form-mark.entity';
import { WORKSPACE_ENTITY } from '~/freq-words/resources/workspaces/stubs/workspaces';

describe('Word Marks (e2e)', () => {
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

	describe('upsert mark', () => {
		describe(`pass new lemma and new word form`, () => {
			it(`should return created mark`, async () => {
				const dto = UPSERT_WORD_MARK_DTO('differ');

				const resp = await request(app.getHttpServer())
					.post(WORD_MARKS_URLS.upsert)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body.id).toBeDefined();
				expect(resp.body.count).toBe(1);
				expect(resp.body.wordFormMarks[0]).toEqual(
					expect.objectContaining({ count: 1, isLemma: false })
				);
				expect(resp.body.wordFormMarks[0].wordForm).toEqual(
					expect.objectContaining({ name: dto.wordForm })
				);
				expect(resp.body.wordFormMarks[1]).toEqual(
					expect.objectContaining({ count: 0, isLemma: true })
				);
				expect(resp.body.wordFormMarks[1].wordForm).toEqual(
					expect.objectContaining({ name: dto.lemma })
				);
			});
		});

		describe(`pass existing lemma and word form`, () => {
			it(`should return updated mark`, async () => {
				const dto = UPSERT_WORD_MARK_DTO('differ');
				const { body: createdMark } = await request(app.getHttpServer())
					.post(WORD_MARKS_URLS.upsert)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				const resp = await request(app.getHttpServer())
					.post(WORD_MARKS_URLS.upsert)
					.set('Authorization', `Bearer ${jwt}`)
					.send(dto);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual({
					...createdMark,
					count: createdMark.count + 1,
					wordFormMarks: createdMark.wordFormMarks.map((wordFormMark: WordFormMark) => {
						if (wordFormMark.wordForm.name === dto.wordForm) {
							return { ...wordFormMark, count: wordFormMark.count + 1 };
						}
						return wordFormMark;
					}),
				});
			});
		});
	});

	describe('get many marks', () => {
		it('should return all marks for a workspace', async () => {
			const dto: GetWordMarksDto = { workspaceId: WORKSPACE_ENTITY.id };
			const resp = await request(app.getHttpServer())
				.get(WORD_MARKS_URLS.getMany)
				.set('Authorization', `Bearer ${jwt}`)
				.query(dto);

			expect(resp.status).toBe(HttpStatus.OK);
			expect(Array.isArray(resp.body)).toBeTruthy();
			expect(resp.body[0]).toEqual(
				expect.objectContaining({ id: WORD_MARK_ENTITY.id, count: WORD_MARK_ENTITY.count })
			);
		});
	});

	describe('get one mark', () => {
		describe(`pass id of an existing mark`, () => {
			it('should return a mark by id', async () => {
				const resp = await request(app.getHttpServer())
					.get(WORD_MARKS_URLS.get(WORD_MARK_ENTITY.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.OK);
				expect(resp.body).toEqual(
					expect.objectContaining({ id: WORD_MARK_ENTITY.id, count: WORD_MARK_ENTITY.count })
				);
			});
		});

		describe(`pass id of a non-existing mark`, () => {
			it('should return word mark not found err msg', async () => {
				const resp = await request(app.getHttpServer())
					.get(WORD_MARKS_URLS.get(-1))
					.set('Authorization', `Bearer ${jwt}`);

				expect(resp.status).toBe(HttpStatus.NOT_FOUND);
				expect(resp.body).toEqual({ err: `word mark #${-1} not found` });
			});
		});
	});
});
