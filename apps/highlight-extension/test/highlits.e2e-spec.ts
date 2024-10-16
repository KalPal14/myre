import 'reflect-metadata';
import request from 'supertest';

import { bootstrap } from '~/highlight-extension/main';
import { HIGHLIGHTS_FULL_PATH } from '~/highlight-extension/common/constants/routes/highlights';
import { RIGHT_PAGE, INVALID_PAGE } from '~/highlight-extension/common/constants/spec/pages';
import {
	RIGHT_HIGHLIGHT,
	UPDATED_HIGHLIGHT,
	WRONG_HIGHLIGHT,
} from '~/highlight-extension/common/constants/spec/highlights';
import { USERS_FULL_PATH } from '~/iam/common/constants/routes/users';
import { RIGHT_USER } from '~/iam/common/constants/spec/users';
import {
	RIGHT_END_NODE,
	RIGHT_START_NODE,
	UPDATED_END_NODE,
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

describe('Highlits', () => {
	it('create highlight - wrong: unauthorized user', async () => {
		const res = await request(app).post(HIGHLIGHTS_FULL_PATH.create).send({
			pageUrl: RIGHT_PAGE.url,
			text: RIGHT_HIGHLIGHT.text,
			color: RIGHT_HIGHLIGHT.color,
		});

		expect(res.statusCode).toBe(401);
	});

	it('create highlight - wrong: incorrect input data format', async () => {
		const res = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				pageUrl: INVALID_PAGE.url,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(422);
	});

	it('create highlight - success: for an existing page', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		const res = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.text).toBe(RIGHT_HIGHLIGHT.text);
		expect(res.body.pageId).toBe(RIGHT_HIGHLIGHT.pageId);
		expect(res.body.startContainer.text).toBe(RIGHT_START_NODE.text);
		expect(res.body.endContainer.text).toBe(RIGHT_END_NODE.text);
	});

	it('get highlights - wrong: ID list not specified', async () => {
		const res = await request(app)
			.get(HIGHLIGHTS_FULL_PATH.get)
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(422);
		expect(res.body.length).toBeDefined();
	});

	it('get highlights - success: ID of a non-existent highlights was sent', async () => {
		const res = await request(app)
			.get(HIGHLIGHTS_FULL_PATH.get)
			.set('Authorization', `Bearer ${jwt}`)
			.query({
				ids: JSON.stringify([-1, -2]),
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveLength(0);
	});

	it('get highlights - success', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		const newHighlight1 = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});
		const newHighlight2 = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});

		const res = await request(app)
			.get(HIGHLIGHTS_FULL_PATH.get)
			.set('Authorization', `Bearer ${jwt}`)
			.query({
				ids: JSON.stringify([newHighlight1.body.id, newHighlight2.body.id]),
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([newHighlight1.body, newHighlight2.body]);
	});

	it('update highlight - success', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		const { id: _upendid, ...UPDATE_NODE_DATA } = UPDATED_END_NODE;
		const createHighlightRes = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});
		const highlightId = createHighlightRes.body.id;

		const res = await request(app)
			.patch(HIGHLIGHTS_FULL_PATH.update.replace(':id', highlightId.toString()))
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				note: UPDATED_HIGHLIGHT.note as string | undefined,
				text: UPDATED_HIGHLIGHT.text,
				color: UPDATED_HIGHLIGHT.color,
				endContainer: UPDATE_NODE_DATA,
				endOffset: UPDATED_HIGHLIGHT.endOffset,
				order: UPDATED_HIGHLIGHT.order,
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			...UPDATED_HIGHLIGHT,
			id: highlightId,
			startContainerId: createHighlightRes.body.startContainer.id,
			endContainerId: createHighlightRes.body.endContainer.id,
			startContainer: {
				...createHighlightRes.body.startContainer,
			},
			endContainer: {
				id: createHighlightRes.body.endContainer.id,
				...UPDATE_NODE_DATA,
			},
		});
	});

	it('update highlight - wrong: update a non-existent highlight', async () => {
		const res = await request(app)
			.patch(HIGHLIGHTS_FULL_PATH.update.replace(':id', WRONG_HIGHLIGHT.id!.toString()))
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				note: UPDATED_HIGHLIGHT.note as string | undefined,
				text: UPDATED_HIGHLIGHT.text,
				color: UPDATED_HIGHLIGHT.color,
			});

		expect(res.statusCode).toBe(422);
		expect(res.body.err).toBe('There is no highlight with this ID');
	});

	it('individual update highlights - success: try to update two existings and one unexisting', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		const { id: _upendid, ..._ } = UPDATED_END_NODE;
		const createHighlightRes1 = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});
		const createHighlightRes2 = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});
		const highlightId1 = createHighlightRes1.body.id;
		const highlightId2 = createHighlightRes2.body.id;
		const unexistingHighlightId = highlightId1 * highlightId2;

		const res = await request(app)
			.patch(HIGHLIGHTS_FULL_PATH.individualUpdateMany)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				highlights: [
					{
						id: highlightId1,
						payload: {
							text: `new text for highlight: ${highlightId1}`,
						},
					},
					{
						id: highlightId2,
						payload: {
							text: `new text for highlight: ${highlightId2}`,
						},
					},
					{
						id: unexistingHighlightId,
						payload: {
							text: `new text for highlight: ${unexistingHighlightId}`,
						},
					},
				],
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([
			{
				...createHighlightRes1.body,
				text: `new text for highlight: ${highlightId1}`,
			},
			{
				...createHighlightRes2.body,
				text: `new text for highlight: ${highlightId2}`,
			},
		]);
	});

	it('individual update highlights - success: try to update unexisting only', async () => {
		const res = await request(app)
			.patch(HIGHLIGHTS_FULL_PATH.individualUpdateMany)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				highlights: [
					{
						id: WRONG_HIGHLIGHT.id,
						payload: {
							text: `new text`,
						},
					},
				],
			});

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual([]);
	});

	it('individual update highlights - wrong: wrong request body', async () => {
		const res = await request(app)
			.patch(HIGHLIGHTS_FULL_PATH.individualUpdateMany)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				highlights: [
					{
						id: WRONG_HIGHLIGHT.id,
						payload: {
							order: 'text',
						},
					},
				],
			});

		expect(res.statusCode).toBe(422);
	});

	it('delete highlight - success', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		const createHighlightRes = await request(app)
			.post(HIGHLIGHTS_FULL_PATH.create)
			.set('Authorization', `Bearer ${jwt}`)
			.send({
				workspaceId: WORKSPACE_MODEL.id,
				pageUrl: RIGHT_PAGE.url,
				startContainer: START_NODE,
				endContainer: END_NODE,
				startOffset: RIGHT_HIGHLIGHT.startOffset,
				endOffset: RIGHT_HIGHLIGHT.endOffset,
				text: RIGHT_HIGHLIGHT.text,
				color: RIGHT_HIGHLIGHT.color,
			});
		const highlightId = createHighlightRes.body.id;
		const res = await request(app)
			.delete(HIGHLIGHTS_FULL_PATH.delete.replace(':id', highlightId.toString()))
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(createHighlightRes.body.id);
	});

	it('delete highlight - wrong: non-existent highlight', async () => {
		const res = await request(app)
			.delete(HIGHLIGHTS_FULL_PATH.delete.replace(':id', WRONG_HIGHLIGHT.id!.toString()))
			.set('Authorization', `Bearer ${jwt}`);

		expect(res.statusCode).toBe(422);
		expect(res.body.err).toBe('There is no highlight with this ID');
	});
});
