import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '~/highlight-extension/main';
import { USERS_FULL_PATH } from '~/iam/common/constants/routes/users';
import { RIGHT_USER } from '~/iam/common/constants/spec/users';
import { PAGES_FULL_PATH } from '~/highlight-extension/common/constants/routes/pages';
import {
	RIGHT_PAGE,
	UPDATED_PAGE,
	WRONG_PAGE,
} from '~/highlight-extension/common/constants/spec/pages';
import { HIGHLIGHTS_FULL_PATH } from '~/highlight-extension/common/constants/routes/highlights';
import { RIGHT_HIGHLIGHT } from '~/highlight-extension/common/constants/spec/highlights';
import {
	RIGHT_START_NODE,
	RIGHT_END_NODE,
} from '~/highlight-extension/common/constants/spec/nodes';
import { WORKSPACE_MODEL } from '~/highlight-extension/common/constants/spec/workspaces';
import { bootstrap as iamBootstrap } from '~/iam/main';

import type { Express } from 'express';

let app: Express;
let jwt: string;

beforeAll(async () => {
	const application = await bootstrap('test');
	app = application.app;

	const { app: iamApp } = await iamBootstrap('test');

	const loginRes = await request(iamApp).post(USERS_FULL_PATH.login).send({
		userIdentifier: RIGHT_USER.username,
		password: RIGHT_USER.password,
	});
	jwt = loginRes.body.jwt;
});

describe('Pages', () => {
	it('update page - success', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		const createdHighlightRes = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: 'https://example.com/',
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			})
			.set('Authorization', `Bearer ${jwt}`);
		const pageId = createdHighlightRes.body.pageId;

		const res = await request(app)
			.patch(PAGES_FULL_PATH.updatePage.replace(':id', pageId))
			.send({
				url: UPDATED_PAGE.url,
			})
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(pageId);
		expect(res.body.url).toBe(UPDATED_PAGE.url);
	});

	it('get page info - success', async () => {
		const res = await request(app)
			.get(PAGES_FULL_PATH.getPage)
			.query({
				url: RIGHT_PAGE.url,
			})
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(RIGHT_PAGE.id);
		expect(res.body.workspaceId).toBe(RIGHT_PAGE.workspaceId);
		expect(res.body.highlights.length).not.toBe(0);
		expect(res.body.highlights[0].startContainer.id).toBeDefined();
		expect(res.body.highlights[0].endContainer.id).toBeDefined();
	});

	it('get page info - wrong: trying to get a non-existent page', async () => {
		const res = await request(app)
			.get(PAGES_FULL_PATH.getPage)
			.query({
				url: WRONG_PAGE.url,
			})
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			id: null,
		});
	});

	it('get page info - wrong: not authorizede', async () => {
		const res = await request(app).get(PAGES_FULL_PATH.getPage).send({
			url: RIGHT_PAGE.url,
		});

		expect(res.statusCode).toBe(401);
		expect(res.body.err).toBeDefined();
	});
});
