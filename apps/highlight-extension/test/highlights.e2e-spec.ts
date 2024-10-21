import 'reflect-metadata';
import request from 'supertest';

import { UpdateHighlightDto } from '~libs/dto/highlight-extension';

import { bootstrap } from '~/highlight-extension/main';
import { HIGHLIGHTS_URLS } from '~/highlight-extension/common/constants/routes/highlights';
import { USERS_URLS } from '~/iam/common/constants/routes/users';
import { bootstrap as iamBootstrap } from '~/iam/main';
import { LOGIN_USER_DTO } from '~/iam/common/constants/spec/users';
import {
	CREATE_HIGHLIGHT_DTO,
	HIGHLIGHT,
	HIGHLIGHT_MODEL,
} from '~/highlight-extension/common/constants/spec/highlights';
import { PAGE } from '~/highlight-extension/common/constants/spec/pages';
import { END_NODE, START_NODE } from '~/highlight-extension/common/constants/spec/nodes';

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

describe('Highlits', () => {
	describe('create highlight', () => {
		describe('unauthorised user', () => {
			it('return unauthorized error', async () => {
				const res = await request(app).post(HIGHLIGHTS_URLS.create).send(CREATE_HIGHLIGHT_DTO);

				expect(res.statusCode).toBe(401);
			});
		});

		describe('pass incorrect dto format', () => {
			it('return dto validation error', async () => {
				const res = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send({ ...CREATE_HIGHLIGHT_DTO, color: 'color' });

				expect(res.statusCode).toBe(422);
				expect(res.body).toEqual([
					{
						property: 'color',
						value: 'color',
						errors: ['The color field must contain a valid RGB or HEX color'],
					},
				]);
			});
		});

		describe('pass correct dto', () => {
			it('return created highlight', async () => {
				const res = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send({
						...CREATE_HIGHLIGHT_DTO,
						pageUrl: PAGE.url,
					});

				expect(res.statusCode).toBe(201);
				expect(res.body).toEqual({
					id: res.body.id,
					...HIGHLIGHT,
					order: res.body.order,
					startContainer: {
						id: res.body.startContainer.id,
						...START_NODE,
					},
					endContainer: {
						id: res.body.endContainer.id,
						...END_NODE,
					},
					startContainerId: res.body.startContainer.id,
					endContainerId: res.body.endContainer.id,
					startOffset: CREATE_HIGHLIGHT_DTO.startOffset,
					endOffset: CREATE_HIGHLIGHT_DTO.endOffset,
					text: CREATE_HIGHLIGHT_DTO.text,
					color: CREATE_HIGHLIGHT_DTO.color,
					note: null,
				});
			});
		});
	});

	describe('get highlights', () => {
		describe('do not pass list of highlights ids', () => {
			it('return dto validation error', async () => {
				const res = await request(app)
					.get(HIGHLIGHTS_URLS.getMany)
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(422);
				expect(res.body.length).toBeDefined();
			});
		});

		describe('pass ids of non-existent highlights', () => {
			it('return empty array', async () => {
				const res = await request(app)
					.get(HIGHLIGHTS_URLS.getMany)
					.set('Authorization', `Bearer ${jwt}`)
					.query({
						ids: JSON.stringify([-1, -2]),
					});

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual([]);
			});
		});

		describe('pass existing highlights ids', () => {
			it('return highlights list', async () => {
				const newHighlight1 = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_HIGHLIGHT_DTO);
				const newHighlight2 = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_HIGHLIGHT_DTO);

				const res = await request(app)
					.get(HIGHLIGHTS_URLS.getMany)
					.set('Authorization', `Bearer ${jwt}`)
					.query({
						ids: JSON.stringify([newHighlight1.body.id, newHighlight2.body.id]),
					});

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual([newHighlight1.body, newHighlight2.body]);
			});
		});
	});

	describe('update highlight', () => {
		const UPDATE_DTO: UpdateHighlightDto = {
			text: 'new text',
			startContainer: { text: 'new text', indexNumber: 2, sameElementsAmount: 3 },
		};

		describe('pass existing highlight id', () => {
			it('return updated highlight', async () => {
				const newHighlightRes = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_HIGHLIGHT_DTO);

				const res = await request(app)
					.patch(HIGHLIGHTS_URLS.update(newHighlightRes.body.id))
					.set('Authorization', `Bearer ${jwt}`)
					.send(UPDATE_DTO);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({
					...newHighlightRes.body,
					text: UPDATE_DTO.text,
					startContainer: {
						id: newHighlightRes.body.startContainer.id,
						...UPDATE_DTO.startContainer,
					},
				});
			});
		});

		describe('pass id of non-existent highlight', () => {
			it('throw error', async () => {
				const id = -1;
				const res = await request(app)
					.patch(HIGHLIGHTS_URLS.update(id))
					.set('Authorization', `Bearer ${jwt}`)
					.send(UPDATE_DTO);

				expect(res.statusCode).toBe(404);
				expect(res.body.err).toBe(`highlight #${id} not found`);
			});
		});
	});

	describe('individual update many highlights', () => {
		describe('pass two existings and one unexisting highlights', () => {
			it('return updated highlights', async () => {
				const newHighlightRes1 = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_HIGHLIGHT_DTO);
				const newHighlightRes2 = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_HIGHLIGHT_DTO);
				const newHighlightId1 = newHighlightRes1.body.id;
				const newHighlightId2 = newHighlightRes2.body.id;
				const unexistingHighlightId = -1;
				const DTO = {
					highlights: [
						{
							id: newHighlightId1,
							payload: {
								text: `new text for highlight: ${newHighlightId1}`,
							},
						},
						{
							id: newHighlightId2,
							payload: {
								text: `new text for highlight: ${newHighlightId2}`,
							},
						},
						{
							id: unexistingHighlightId,
							payload: {
								text: `new text for highlight: ${unexistingHighlightId}`,
							},
						},
					],
				};

				const res = await request(app)
					.patch(HIGHLIGHTS_URLS.individualUpdateMany)
					.set('Authorization', `Bearer ${jwt}`)
					.send(DTO);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual([
					{
						...newHighlightRes1.body,
						...DTO.highlights[0].payload,
					},
					{
						...newHighlightRes2.body,
						...DTO.highlights[1].payload,
					},
				]);
			});
		});

		describe('pass only unexisting highlights', () => {
			it('return empty array', async () => {
				const res = await request(app)
					.patch(HIGHLIGHTS_URLS.individualUpdateMany)
					.set('Authorization', `Bearer ${jwt}`)
					.send({
						highlights: [
							{
								id: -1,
								payload: {
									text: `new text`,
								},
							},
							{
								id: -2,
								payload: {
									text: `new text`,
								},
							},
						],
					});

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual([]);
			});
		});

		describe('pass incorrect dto format', () => {
			it('return dto validation error', async () => {
				const res = await request(app)
					.patch(HIGHLIGHTS_URLS.individualUpdateMany)
					.set('Authorization', `Bearer ${jwt}`)
					.send({
						highlights: [
							{
								id: HIGHLIGHT_MODEL.id,
								payload: {
									order: 'text',
								},
							},
						],
					});

				expect(res.statusCode).toBe(422);
			});
		});
	});

	describe('delete highlight', () => {
		describe('pass existing highlight ID', () => {
			it('return deleted highlight', async () => {
				const newHighlightRes = await request(app)
					.post(HIGHLIGHTS_URLS.create)
					.set('Authorization', `Bearer ${jwt}`)
					.send(CREATE_HIGHLIGHT_DTO);

				const res = await request(app)
					.delete(HIGHLIGHTS_URLS.delete(newHighlightRes.body.id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({ ...newHighlightRes.body });
			});
		});

		describe('pass ID of non-existent highlight', () => {
			it('return error message', async () => {
				const id = -1;
				const res = await request(app)
					.delete(HIGHLIGHTS_URLS.delete(id))
					.set('Authorization', `Bearer ${jwt}`);

				expect(res.statusCode).toBe(404);
				expect(res.body.err).toBe(`highlight #${id} not found`);
			});
		});
	});
});
