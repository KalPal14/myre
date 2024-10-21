import 'reflect-metadata';
import { Container } from 'inversify';
import { PageModel } from 'apps/highlight-extension/prisma/client';

import { HTTPError } from '~libs/express-core';
import { UpdatePageDto } from '~libs/dto/highlight-extension';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { Page } from '~/highlight-extension/domain/page/page';
import { IPageFactory } from '~/highlight-extension/domain/page/factory/page-factory.interface';
import { PageFactory } from '~/highlight-extension/domain/page/factory/page.factory';
import { WORKSPACE_MODEL } from '~/highlight-extension/common/constants/spec/workspaces';
import {
	CREATE_PAGE_DTO,
	PAGE,
	PAGE_MODEL,
} from '~/highlight-extension/common/constants/spec/pages';
import {
	HIGHLIGHT_DEEP_MODEL,
	HIGHLIGHT_MODEL,
} from '~/highlight-extension/common/constants/spec/highlights';

import { IPagesServise } from './pages.service.interface';
import { PagesServise } from './pages.service';

const highlightsRepositoryMock: IHighlightsRepository = {
	findBy: jest.fn(),
	deepFindBy: jest.fn(),
	findManyBy: jest.fn(),
	deepFindManyBy: jest.fn(),
	deepFindManyIn: jest.fn(),

	create: jest.fn(),
	update: jest.fn(),
	updateMany: jest.fn(),
	individualUpdateMany: jest.fn(),
	delete: jest.fn(),
};
const pagesRepositoryMock: IPagesRepository = {
	findBy: jest.fn(),
	deepFindBy: jest.fn(),
	findManyBy: jest.fn(),
	deepFindManyBy: jest.fn(),

	create: jest.fn(),
	update: jest.fn(),
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
	container.bind<IPageFactory>(TYPES.PageFactory).to(PageFactory);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	highlightsRepository = container.get<IHighlightsRepository>(TYPES.HighlightsRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('PagesServise', () => {
	describe('create page', () => {
		describe('pass new page url for workspace', () => {
			it('return created page', async () => {
				pagesRepository.findBy = jest.fn().mockReturnValue(null);
				pagesRepository.create = jest.fn().mockImplementation(
					(page: Page): PageModel => ({
						id: PAGE_MODEL.id,
						...page,
					})
				);

				const result = await pagesServise.create(CREATE_PAGE_DTO);

				expect(result).toEqual({ id: PAGE_MODEL.id, ...CREATE_PAGE_DTO });
			});
		});

		describe('pass existing page url for workspace', () => {
			it('throw an error', async () => {
				pagesRepository.findBy = jest.fn().mockReturnValue(PAGE_MODEL);

				try {
					await pagesServise.create(CREATE_PAGE_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('This page already exists');
				}
			});
		});
	});

	describe('update page', () => {
		const UPDATE_DTO: UpdatePageDto = {
			workspaceId: PAGE.workspaceId,
			url: 'https://example.com/update',
		};
		describe('pass data to update without merging (page with new url does not exist in current workspace)', () => {
			it('update page without merging', async () => {
				pagesRepositoryMock.deepFindBy = jest
					.fn()
					.mockReturnValueOnce({ ...PAGE_MODEL, highlights: [HIGHLIGHT_MODEL] })
					.mockReturnValueOnce(null);
				const updateSpy = jest.spyOn(pagesRepositoryMock, 'update');

				await pagesServise.update(PAGE_MODEL.id, UPDATE_DTO);

				expect(updateSpy).toHaveBeenCalledWith(PAGE_MODEL.id, { url: UPDATE_DTO.url });
			});
		});

		describe('pass data to update with merging (page with new url already exist in current workspace)', () => {
			it('merge pages and update', async () => {
				const pageToMergeId = PAGE_MODEL.id + 1;
				pagesRepositoryMock.deepFindBy = jest
					.fn()
					.mockReturnValueOnce({ ...PAGE_MODEL, highlights: [HIGHLIGHT_MODEL] })
					.mockReturnValueOnce({
						...PAGE_MODEL,
						id: pageToMergeId,
						highlights: [
							{ ...HIGHLIGHT_MODEL, id: HIGHLIGHT_MODEL.id + 1 },
							{ ...HIGHLIGHT_MODEL, id: HIGHLIGHT_MODEL.id + 2, order: HIGHLIGHT_MODEL.order + 1 },
						],
					});
				const individualUpdateManyHighlightsSpy = jest.spyOn(
					highlightsRepositoryMock,
					'individualUpdateMany'
				);
				const updateManyHighlightsSpy = jest.spyOn(highlightsRepositoryMock, 'updateMany');
				const deletePageSpy = jest.spyOn(pagesRepositoryMock, 'delete');
				const updatePageSpy = jest.spyOn(pagesRepositoryMock, 'update');

				await pagesServise.update(PAGE_MODEL.id, UPDATE_DTO);

				expect(individualUpdateManyHighlightsSpy).toHaveBeenCalledWith({
					highlights: [{ id: HIGHLIGHT_MODEL.id, payload: { order: 3 } }],
				});
				expect(updateManyHighlightsSpy).toHaveBeenCalledWith(
					[HIGHLIGHT_MODEL.id + 1, HIGHLIGHT_MODEL.id + 2],
					{ pageId: PAGE_MODEL.id }
				);
				expect(deletePageSpy).toHaveBeenCalledWith(pageToMergeId);
				expect(updatePageSpy).toHaveBeenCalledWith(PAGE_MODEL.id, { url: UPDATE_DTO.url });
			});
		});

		describe('pass ID of a non-existent page', () => {
			it('throw error', async () => {
				pagesRepositoryMock.deepFindBy = jest.fn().mockReturnValue(null);

				try {
					await pagesServise.update(PAGE_MODEL.id, UPDATE_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`page #${PAGE_MODEL.id} not found`);
				}
			});
		});

		describe('pass a new url the same as the url of page to be updated', () => {
			it('throw error', async () => {
				pagesRepositoryMock.deepFindBy = jest
					.fn()
					.mockReturnValue({ ...PAGE_MODEL, url: UPDATE_DTO.url, highlights: [HIGHLIGHT_MODEL] });

				try {
					await pagesServise.update(PAGE_MODEL.id, UPDATE_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`The new URL cannot be the same as the current one`);
				}
			});
		});
	});

	describe('get page full info', () => {
		describe('pass url of an existent page', () => {
			it('return page info', async () => {
				pagesRepository.findBy = jest.fn().mockReturnValue(PAGE_MODEL);
				highlightsRepository.deepFindManyBy = jest.fn().mockReturnValue([HIGHLIGHT_DEEP_MODEL]);

				const result = await pagesServise.getFullInfo(PAGE.url, PAGE.workspaceId);

				expect(result).toEqual({
					...PAGE_MODEL,
					highlights: [HIGHLIGHT_DEEP_MODEL],
				});
			});
		});

		describe('pass url of a non-existent page', () => {
			it('return null', async () => {
				pagesRepository.findBy = jest.fn().mockReturnValue(null);

				const result = await pagesServise.getFullInfo(PAGE.url, PAGE.workspaceId);

				expect(result).toBe(null);
			});
		});
	});

	describe('get pages short info', () => {
		describe('pass ID of workspace with highlights', () => {
			it('return empty pages list', () => {});
		});

		describe('pass ID of workspace without highlights', () => {
			it('return pages list', async () => {
				pagesRepository.deepFindManyBy = jest.fn().mockReturnValue([]);

				const result = await pagesServise.getPagesShortInfo(WORKSPACE_MODEL.id);

				expect(result).toHaveLength(0);
			});
		});
	});

	it('get pages info - success: user with highlights', async () => {
		pagesRepository.deepFindManyBy = jest.fn().mockReturnValue([
			{
				...PAGE_MODEL,
				highlights: [HIGHLIGHT_MODEL, HIGHLIGHT_MODEL, HIGHLIGHT_MODEL],
			},
			{
				...PAGE_MODEL,
				id: PAGE_MODEL.id + 1,
				highlights: [HIGHLIGHT_MODEL],
			},
		]);

		const result = await pagesServise.getPagesShortInfo(WORKSPACE_MODEL.id);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({
			id: PAGE_MODEL.id,
			workspaceId: PAGE_MODEL.workspaceId,
			url: PAGE_MODEL.url,
			highlightsCount: 3,
			notesCount: 3,
		});
		expect(result[1]).toEqual({
			id: PAGE_MODEL.id + 1,
			workspaceId: PAGE_MODEL.workspaceId,
			url: PAGE_MODEL.url,
			highlightsCount: 1,
			notesCount: 1,
		});
	});
});
