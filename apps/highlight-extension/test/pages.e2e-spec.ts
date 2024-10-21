import 'reflect-metadata';
import request from 'supertest';

import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { random } from '~libs/common/index';

import { bootstrap } from '~/highlight-extension/main';
import { USERS_URLS } from '~/iam/common/constants/routes/users';
import { PAGES_URLS } from '~/highlight-extension/common/constants/routes/pages';
import { HIGHLIGHTS_URLS } from '~/highlight-extension/common/constants/routes/highlights';
import { bootstrap as iamBootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/constants/spec/users';
import {
	CREATE_HIGHLIGHT_DTO,
	HIGHLIGHT_DEEP_MODEL,
} from '~/highlight-extension/common/constants/spec/highlights';
import { PAGE, PAGE_MODEL } from '~/highlight-extension/common/constants/spec/pages';

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

describe('Pages', () => {
	describe('update page', () => {
		describe('pass correct dto', () => {
			it('return updated page', async () => {
				const newHighlightRes = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.send({ ...CREATE_HIGHLIGHT_DTO, pageUrl: PAGE.url + random() })
					.set('Authorization', `Bearer ${jwt}`);
				const pageId = newHighlightRes.body.pageId;
				const DTO: UpdatePageDto = {
					url: 'https://example.com/update',
				};

				const res = await request(app)
					.patch(PAGES_URLS.update(pageId))
					.send(DTO)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body.id).toBe(pageId);
				expect(res.body.url).toBe(DTO.url);
			});
		});
	});

	describe('get page full info', () => {
		describe('pass correct url and workspace id', () => {
			it('return page with all highlights', async () => {
				const DTO: GetPageDto = {
					workspaceId: PAGE.workspaceId.toString(),
					url: PAGE.url,
				};

				const res = await request(app)
					.get(PAGES_URLS.get)
					.query(DTO)
					.set('Authorization', `Bearer ${jwt}`);

				const { highlights, ...pageData } = res.body;
				expect(res.statusCode).toBe(200);
				expect(pageData).toEqual(PAGE_MODEL);
				expect(highlights[0]).toEqual(HIGHLIGHT_DEEP_MODEL);
			});
		});

		describe('pass url of page that does not exist workspace', () => {
			it('return { id: null }', async () => {
				const DTO: GetPageDto = {
					workspaceId: PAGE.workspaceId.toString(),
					url: PAGE.url + random(),
				};

				const res = await request(app)
					.get(PAGES_URLS.get)
					.query(DTO)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({
					id: null,
				});
			});
		});

		describe('unauthorised user', () => {
			it('return unauthorised error', async () => {
				const res = await request(app).get(PAGES_URLS.get).send({
					url: PAGE.url,
				});

				expect(res.statusCode).toBe(401);
				expect(res.body.err).toBeDefined();
			});
		});
	});
});
