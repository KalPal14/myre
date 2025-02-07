import 'reflect-metadata';
import request from 'supertest';
import { v4 } from 'uuid';

import { configEnv } from '~libs/express-core/config';
import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { USERS_URLS } from '~libs/routes/iam';
import { PAGES_URLS, HIGHLIGHTS_URLS } from '~libs/routes/highlight-extension';

import { bootstrap } from '~/highlight-extension/main';
import { bootstrap as iamBootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/stubs/users';
import {
	CREATE_HIGHLIGHT_DTO,
	HIGHLIGHT_DEEP_MODEL,
} from '~/highlight-extension/common/stubs/highlights';
import { PAGE, PAGE_MODEL } from '~/highlight-extension/common/stubs/pages';

import type { Express } from 'express';

configEnv();

let app: Express;
let jwt: string;

beforeAll(async () => {
	const application = await bootstrap();
	app = application.app;

	const {
		app: { app: iamApp },
	} = await iamBootstrap();

	const loginRes = await request(iamApp).post(USERS_URLS.login).send(LOGIN_USER_DTO);
	jwt = loginRes.body.jwt;
});

describe('Pages', () => {
	describe('update page', () => {
		describe('pass correct dto', () => {
			it('return updated page', async () => {
				const newHighlightRes = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.send({ ...CREATE_HIGHLIGHT_DTO, pageUrl: PAGE.url + v4() })
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
					url: PAGE.url + v4(),
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

				expect(res.statusCode).toBe(403);
				expect(res.body.err).toBeDefined();
			});
		});
	});
});
