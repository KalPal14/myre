import 'reflect-metadata';
import { Container } from 'inversify';
import { PageModel } from 'apps/highlight-extension/prisma/client';

import { RIGHT_HIGHLIGHT } from '~/highlight-extension/common/constants/spec/highlights';
import {
	RIGHT_START_NODE,
	RIGHT_END_NODE,
} from '~/highlight-extension/common/constants/spec/nodes';
import {
	RIGHT_PAGE,
	UPDATED_PAGE,
	WRONG_PAGE,
} from '~/highlight-extension/common/constants/spec/pages';
import { RIGHT_USER_JWT, RIGHT_USER } from '~/highlight-extension/common/constants/spec/users';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IPage } from '~/highlight-extension/entities/page-entity/page.entity.interface';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';

import { IPagesServise } from './pages.service.interface';
import { PagesServise } from './pages.service';

const pagesRepositoryMock: IPagesRepository = {
	create: jest.fn(),
	update: jest.fn(),
	findByUrl: jest.fn(),
	findById: jest.fn(),
	findAll: jest.fn(),
	delete: jest.fn(),
};
const highlightsRepositoryMock: IHighlightsRepository = {
	create: jest.fn(),
	update: jest.fn(),
	updateMany: jest.fn(),
	individualUpdateMany: jest.fn(),
	findById: jest.fn(),
	findAllByIds: jest.fn(),
	findAllByPageId: jest.fn(),
	delete: jest.fn(),
};

const container = new Container();
let pagesRepository: IPagesRepository;
let highlightsRepository: IHighlightsRepository;
let pagesServise: IPagesServise;

beforeAll(() => {
	container.bind<IPagesRepository>(TYPES.PagesRepository).toConstantValue(pagesRepositoryMock);
	container
		.bind<IHighlightsRepository>(TYPES.HighlightsRepository)
		.toConstantValue(highlightsRepositoryMock);
	container.bind<IPagesServise>(TYPES.PagesServise).to(PagesServise);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	highlightsRepository = container.get<IHighlightsRepository>(TYPES.HighlightsRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
});

describe('Pages Servise', () => {
	it('create page - success', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		pagesRepository.create = jest.fn().mockImplementation(
			(page: IPage): PageModel => ({
				id: RIGHT_PAGE.id,
				userId: page.userId,
				url: page.url,
			})
		);

		const result = await pagesServise.createPage(RIGHT_PAGE.url, RIGHT_USER_JWT);

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result.id).toBe(RIGHT_PAGE.id);
		expect(result.userId).toBe(RIGHT_PAGE.userId);
		expect(result.url).toBe(RIGHT_PAGE.url);
	});

	it('create page - wrong: this user already has a page with the same url', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesRepository.create = jest.fn().mockImplementation(
			(page: IPage): PageModel => ({
				id: RIGHT_PAGE.id,
				userId: page.userId,
				url: page.url,
			})
		);

		const result = await pagesServise.createPage(RIGHT_PAGE.url, RIGHT_USER_JWT);

		expect(result).toBeInstanceOf(Error);
	});

	it('update page - success', async () => {
		pagesRepositoryMock.findById = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesRepositoryMock.findByUrl = jest.fn().mockReturnValue(null);
		const updateSpy = jest.spyOn(pagesRepositoryMock, 'update');

		await pagesServise.updatePage(RIGHT_USER.id, RIGHT_PAGE.id, { url: UPDATED_PAGE.url });

		expect(updateSpy).toHaveBeenCalledWith(RIGHT_PAGE.id, { url: UPDATED_PAGE.url });
	});

	it('update page - success: merging pages', async () => {
		const pageToMergeId = UPDATED_PAGE.id + 1;
		pagesRepositoryMock.findById = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesRepositoryMock.findByUrl = jest.fn().mockReturnValue({
			...UPDATED_PAGE,
			id: pageToMergeId,
			highlights: [RIGHT_HIGHLIGHT, { ...RIGHT_HIGHLIGHT, id: RIGHT_HIGHLIGHT.id + 1, order: 2 }],
		});
		highlightsRepositoryMock.findAllByPageId = jest
			.fn()
			.mockReturnValue([{ ...RIGHT_HIGHLIGHT, id: RIGHT_HIGHLIGHT.id + 2 }]);
		const individualUpdateManyHighlightsSpy = jest.spyOn(
			highlightsRepositoryMock,
			'individualUpdateMany'
		);
		const updateManyHighlightsSpy = jest.spyOn(highlightsRepositoryMock, 'updateMany');
		const deletePageSpy = jest.spyOn(pagesRepositoryMock, 'delete');
		const updatePageSpy = jest.spyOn(pagesRepositoryMock, 'update');

		await pagesServise.updatePage(RIGHT_USER.id, RIGHT_PAGE.id, { url: UPDATED_PAGE.url });

		expect(individualUpdateManyHighlightsSpy).toHaveBeenCalledWith({
			highlights: [{ id: RIGHT_HIGHLIGHT.id + 2, payload: { order: 3 } }],
		});
		expect(updateManyHighlightsSpy).toHaveBeenCalledWith(
			[RIGHT_HIGHLIGHT.id, RIGHT_HIGHLIGHT.id + 1],
			{ pageId: RIGHT_PAGE.id }
		);
		expect(deletePageSpy).toHaveBeenCalledWith(pageToMergeId);
		expect(updatePageSpy).toHaveBeenCalledWith(RIGHT_PAGE.id, { url: UPDATED_PAGE.url });
	});

	it('update page - wrong: no page with this ID', async () => {
		pagesRepositoryMock.findById = jest.fn().mockReturnValue(null);
		pagesRepositoryMock.findByUrl = jest.fn().mockReturnValue(null);

		const result = await pagesServise.updatePage(RIGHT_PAGE.id, WRONG_PAGE.id!, {
			url: UPDATED_PAGE.url,
		});

		expect(result).toBeInstanceOf(Error);
	});

	it('get page info - success', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		highlightsRepository.findAllByPageId = jest.fn().mockReturnValue([
			{
				...RIGHT_HIGHLIGHT,
				startContainer: RIGHT_START_NODE,
				endContainer: RIGHT_END_NODE,
			},
		]);

		const result = await pagesServise.getPageInfo(RIGHT_PAGE.url, RIGHT_PAGE.userId);

		expect(result).toEqual({
			...RIGHT_PAGE,
			highlights: [
				{
					...RIGHT_HIGHLIGHT,
					startContainer: RIGHT_START_NODE,
					endContainer: RIGHT_END_NODE,
				},
			],
		});
	});

	it('get page info - success: user does not have a page with this URL', async () => {
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		highlightsRepository.findAllByPageId = jest.fn().mockReturnValue(null);

		const result = await pagesServise.getPageInfo(WRONG_PAGE.url!, WRONG_PAGE.userId!);

		expect(result).toBe(null);
	});

	it('get pages info - success: user without highlights', async () => {
		pagesRepository.findAll = jest.fn().mockReturnValue([]);

		const result = await pagesServise.getPagesInfo(RIGHT_USER.id);

		expect(result).toHaveLength(0);
	});

	it('get pages info - success: user with highlights', async () => {
		pagesRepository.findAll = jest.fn().mockReturnValue([
			{
				...RIGHT_PAGE,
				highlights: [
					RIGHT_HIGHLIGHT,
					{
						...RIGHT_HIGHLIGHT,
						note: null,
					},
				],
			},
			{
				...RIGHT_PAGE,
				highlights: [RIGHT_HIGHLIGHT],
			},
		]);

		const result = await pagesServise.getPagesInfo(RIGHT_USER.id);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			id: RIGHT_PAGE.id,
			userId: RIGHT_PAGE.userId,
			url: RIGHT_PAGE.url,
			highlightsCount: 2,
			notesCount: 1,
		});
		expect(result[1]).toEqual({
			id: RIGHT_PAGE.id,
			userId: RIGHT_PAGE.userId,
			url: RIGHT_PAGE.url,
			highlightsCount: 1,
			notesCount: 1,
		});
	});
});
