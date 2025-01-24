import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { TranslateDto } from '~libs/dto/freq-words';
import { TRANSLATOR_URLS } from '~libs/routes/freq-words';

import { AppModule } from '~/freq-words/app.module';
import {
	ENGLISH_LANGUAGE_ENTITY,
	RUSSIAN_LANGUAGE_ENTITY,
} from '~/freq-words/resources/languages/stubs/languages';

describe('Translator (e2e)', () => {
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

	describe('translate', () => {
		describe('pass the word or phraseology', () => {
			it('should return definition', async () => {
				const dto: TranslateDto = {
					from: ENGLISH_LANGUAGE_ENTITY.id,
					to: RUSSIAN_LANGUAGE_ENTITY.id,
					translate: 'was',
				};

				const resp = await request(app.getHttpServer()).get(TRANSLATOR_URLS.translate).query(dto);

				expect(resp.statusCode).toBe(200);
				expect(resp.body).toEqual(
					expect.objectContaining({
						type: 'definition',
						wordForm: dto.translate,
						lemma: 'be',
					})
				);
				expect(resp.body.definitionFrom.synonyms).toEqual(expect.arrayContaining(['been']));
				expect(resp.body.definitionFrom.description).toBeDefined();
				expect(resp.body.definitionFrom.examples.length).toBeGreaterThan(1);
				expect(resp.body.definitionTo.synonyms).toEqual(expect.arrayContaining(['был']));
				expect(resp.body.definitionTo.description).toBeDefined();
				expect(resp.body.definitionTo.examples.length).toBeGreaterThan(1);
			});
		});

		describe('pass the sentence', () => {
			it('should return translation', async () => {
				const dto: TranslateDto = {
					from: ENGLISH_LANGUAGE_ENTITY.id,
					to: RUSSIAN_LANGUAGE_ENTITY.id,
					translate: 'I want to say hi to everyone',
				};

				const resp = await request(app.getHttpServer()).get(TRANSLATOR_URLS.translate).query(dto);

				expect(resp.statusCode).toBe(200);
				expect(resp.body.type).toBe('translation');
				expect(resp.body.translation).toBeDefined();
			});
		});
	});
});
