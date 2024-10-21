import 'reflect-metadata';
import { Container } from 'inversify';

import { IndividualUpdateHighlightsDto, UpdateHighlightDto } from '~libs/dto/highlight-extension';
import { HTTPError } from '~libs/express-core';
import { ContainerDto } from '~libs/dto/highlight-extension/highlights/common/container.dto';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';
import { IHighlightFactory } from '~/highlight-extension/domain/highlight/factory/highlight-factory.interface';
import { HighlightFactory } from '~/highlight-extension/domain/highlight/factory/highlight.factory';
import {
	HIGHLIGHT_MODEL,
	CREATE_HIGHLIGHT_DTO,
	HIGHLIGHT_DEEP_MODEL,
} from '~/highlight-extension/common/constants/spec/highlights';
import {
	START_NODE_MODEL,
	END_NODE_MODEL,
	START_NODE,
	END_NODE,
} from '~/highlight-extension/common/constants/spec/nodes';
import { CREATE_PAGE_DTO, PAGE_MODEL } from '~/highlight-extension/common/constants/spec/pages';
import { IHighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.interface';

import { IPagesServise } from '../pages-service/pages.service.interface';
import { INodesService } from '../nodes-service/nodes.service.interface';

import { HighlightsService } from './highlights.service';
import { IHighlightsService } from './highlights.service.interface';

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
const pagesServiseMock: IPagesServise = {
	getFullInfo: jest.fn(),
	getPagesShortInfo: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
};
const nodesServiseMock: INodesService = {
	get: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

const container = new Container();
let pagesRepository: IPagesRepository;
let pagesServise: IPagesServise;
let highlightsRepository: IHighlightsRepository;
let highlightsService: IHighlightsService;
let nodesServise: INodesService;

beforeAll(() => {
	container.bind<IPagesRepository>(TYPES.PagesRepository).toConstantValue(pagesRepositoryMock);
	container.bind<IPagesServise>(TYPES.PagesServise).toConstantValue(pagesServiseMock);
	container
		.bind<IHighlightsRepository>(TYPES.HighlightsRepository)
		.toConstantValue(highlightsRepositoryMock);
	container.bind<INodesService>(TYPES.NodesService).toConstantValue(nodesServiseMock);
	container.bind<IHighlightsService>(TYPES.HighlightsService).to(HighlightsService);
	container.bind<IHighlightFactory>(TYPES.HighlightFactory).to(HighlightFactory);

	pagesRepository = container.get<IPagesRepository>(TYPES.PagesRepository);
	pagesServise = container.get<IPagesServise>(TYPES.PagesServise);
	highlightsRepository = container.get<IHighlightsRepository>(TYPES.HighlightsRepository);
	nodesServise = container.get<INodesService>(TYPES.NodesService);
	highlightsService = container.get<IHighlightsService>(TYPES.HighlightsService);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('HighlightsService', () => {
	describe('create highlight', () => {
		describe('pass highlight for new page', () => {
			it('create page and return highlight', async () => {
				pagesRepository.findBy = jest.fn().mockReturnValue(null);
				pagesServise.create = jest.fn().mockReturnValue({ ...PAGE_MODEL, ...CREATE_PAGE_DTO });
				highlightsRepository.findManyBy = jest.fn().mockReturnValue([]);
				nodesServise.create = jest
					.fn()
					.mockReturnValueOnce(START_NODE_MODEL)
					.mockReturnValueOnce(END_NODE_MODEL);
				highlightsRepository.create = jest.fn().mockImplementation(
					(highlight: Highlight): IHighlightDeepModel => ({
						id: HIGHLIGHT_MODEL.id,
						...highlight,
						startContainer: START_NODE_MODEL,
						endContainer: END_NODE_MODEL,
					})
				);
				const createNodeSpy = jest.spyOn(nodesServise, 'create');
				const createPageSpy = jest.spyOn(pagesServise, 'create');

				const result = await highlightsService.create(CREATE_HIGHLIGHT_DTO);

				expect(createPageSpy).toHaveBeenCalledWith(CREATE_PAGE_DTO);
				expect(createNodeSpy).toHaveBeenCalledTimes(2);
				expect(result).toEqual({
					...HIGHLIGHT_DEEP_MODEL,
					startOffset: CREATE_HIGHLIGHT_DTO.startOffset,
					endOffset: CREATE_HIGHLIGHT_DTO.endOffset,
					text: CREATE_HIGHLIGHT_DTO.text,
					note: null,
				});
			});
		});

		describe('pass highlight for existing page', () => {
			it('return highlight', async () => {
				pagesRepository.findBy = jest.fn().mockReturnValue(PAGE_MODEL);
				highlightsRepository.findManyBy = jest
					.fn()
					.mockReturnValue([HIGHLIGHT_MODEL, HIGHLIGHT_MODEL]);
				nodesServise.create = jest
					.fn()
					.mockReturnValueOnce(START_NODE_MODEL)
					.mockReturnValueOnce(END_NODE_MODEL);
				highlightsRepository.create = jest.fn().mockImplementation(
					(highlight: Highlight): IHighlightDeepModel => ({
						id: HIGHLIGHT_MODEL.id,
						...highlight,
						startContainer: START_NODE_MODEL,
						endContainer: END_NODE_MODEL,
					})
				);
				const createNodeSpy = jest.spyOn(nodesServise, 'create');
				const createPageSpy = jest.spyOn(pagesServise, 'create');

				const result = await highlightsService.create(CREATE_HIGHLIGHT_DTO);

				expect(createPageSpy).not.toHaveBeenCalled();
				expect(createNodeSpy).toHaveBeenCalledTimes(2);
				expect(result).toEqual({
					...HIGHLIGHT_DEEP_MODEL,
					startOffset: CREATE_HIGHLIGHT_DTO.startOffset,
					endOffset: CREATE_HIGHLIGHT_DTO.endOffset,
					text: CREATE_HIGHLIGHT_DTO.text,
					note: null,
					order: 3,
				});
			});
		});
	});

	describe('update highlight', () => {
		describe('update highlight and node', () => {
			const UPDATE_DTO: UpdateHighlightDto = {
				note: 'new note',
				text: 'new text',
				startContainer: { ...START_NODE, text: 'updated text' },
			};
			it('return updated highlight with updated nodes', async () => {
				highlightsRepository.deepFindBy = jest.fn().mockReturnValue(HIGHLIGHT_DEEP_MODEL);
				nodesServise.update = jest.fn();
				highlightsRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<Highlight>): IHighlightDeepModel => ({
						...HIGHLIGHT_DEEP_MODEL,
						id,
						...payload,
						startContainer: {
							id: HIGHLIGHT_DEEP_MODEL.id,
							...(UPDATE_DTO.startContainer as ContainerDto),
						},
					})
				);
				const updateNodeSpy = jest.spyOn(nodesServise, 'update');

				const result = await highlightsService.update(HIGHLIGHT_MODEL.id, UPDATE_DTO);

				expect(updateNodeSpy).toHaveBeenCalledTimes(1);
				expect(updateNodeSpy).toHaveBeenCalledWith(START_NODE_MODEL.id, UPDATE_DTO.startContainer);
				expect(result).toEqual({
					...HIGHLIGHT_DEEP_MODEL,
					...UPDATE_DTO,
					startContainer: {
						id: HIGHLIGHT_DEEP_MODEL.startContainer.id,
						...UPDATE_DTO.startContainer,
					},
				});
			});
		});

		describe('update only highlight', () => {
			const UPDATE_DTO: UpdateHighlightDto = {
				note: 'new note',
			};
			it('return updated highlight with not updated nodes', async () => {
				highlightsRepository.deepFindBy = jest.fn().mockReturnValue(HIGHLIGHT_DEEP_MODEL);
				nodesServise.update = jest.fn();
				highlightsRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<Highlight>): IHighlightDeepModel => ({
						...HIGHLIGHT_DEEP_MODEL,
						id,
						...payload,
					})
				);
				const updateNodeSpy = jest.spyOn(nodesServise, 'update');

				const result = await highlightsService.update(HIGHLIGHT_MODEL.id, UPDATE_DTO);

				expect(updateNodeSpy).not.toHaveBeenCalled();
				expect(result).toEqual({
					...HIGHLIGHT_DEEP_MODEL,
					...UPDATE_DTO,
				});
			});
		});

		describe('update only highlight nodes', () => {
			const UPDATE_DTO: UpdateHighlightDto = {
				startContainer: { ...START_NODE, text: 'updated text' },
				endContainer: { ...END_NODE, text: 'updated text' },
			};
			it('return not updated highlight with updated nodes', async () => {
				highlightsRepository.deepFindBy = jest.fn().mockReturnValue(HIGHLIGHT_DEEP_MODEL);
				nodesServise.update = jest.fn();
				highlightsRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<Highlight>): IHighlightDeepModel => ({
						...HIGHLIGHT_DEEP_MODEL,
						id,
						...payload,
						startContainer: {
							id: HIGHLIGHT_DEEP_MODEL.startContainer.id,
							...(UPDATE_DTO.startContainer as ContainerDto),
						},
						endContainer: {
							id: HIGHLIGHT_DEEP_MODEL.endContainer.id,
							...(UPDATE_DTO.endContainer as ContainerDto),
						},
					})
				);
				const updateNodeSpy = jest.spyOn(nodesServise, 'update');

				const result = await highlightsService.update(HIGHLIGHT_MODEL.id, UPDATE_DTO);

				expect(updateNodeSpy).toHaveBeenCalledTimes(2);
				expect(updateNodeSpy).toHaveBeenCalledWith(START_NODE_MODEL.id, UPDATE_DTO.startContainer);
				expect(updateNodeSpy).toHaveBeenCalledWith(END_NODE_MODEL.id, UPDATE_DTO.endContainer);
				expect(result).toEqual({
					...HIGHLIGHT_DEEP_MODEL,
					...UPDATE_DTO,
					startContainer: {
						id: HIGHLIGHT_DEEP_MODEL.startContainer.id,
						...UPDATE_DTO.startContainer,
					},
					endContainer: {
						id: HIGHLIGHT_DEEP_MODEL.endContainer.id,
						...UPDATE_DTO.endContainer,
					},
				});
			});
		});

		describe('pass ID of unexisting highlight', () => {
			it('throw error', async () => {
				highlightsRepository.deepFindBy = jest.fn().mockReturnValue(null);

				try {
					await highlightsService.update(HIGHLIGHT_MODEL.id, {});
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`highlight #${HIGHLIGHT_MODEL.id} not found`);
				}
			});
		});
	});

	describe('individual update many highlights', () => {
		const DTO: IndividualUpdateHighlightsDto = {
			highlights: [
				{ id: 1, payload: { order: 1 } },
				{ id: 2, payload: { order: 2 } },
				{ id: 3, payload: { order: 3 } },
			],
		};
		describe('pass two existing highlights and one unexisting', () => {
			it('call highlightsRepository.individualUpdateMany with two existing highlights', async () => {
				highlightsRepositoryMock.deepFindManyIn = jest
					.fn()
					.mockReturnValue([{ ...HIGHLIGHT_DEEP_MODEL }, { ...HIGHLIGHT_DEEP_MODEL, id: 2 }]);
				const individualUpdateManySpy = jest.spyOn(highlightsRepository, 'individualUpdateMany');

				await highlightsService.individualUpdateMany(DTO);

				expect(individualUpdateManySpy).toHaveBeenCalledWith({
					highlights: [DTO.highlights[0], DTO.highlights[1]],
				});
			});
		});

		describe('pass all unexisting highlights', () => {
			it('call highlightsRepository.individualUpdateMany with empty highlights list', async () => {
				highlightsRepositoryMock.deepFindManyIn = jest.fn().mockReturnValue([]);
				const individualUpdateManySpy = jest.spyOn(highlightsRepository, 'individualUpdateMany');

				await highlightsService.individualUpdateMany(DTO);

				expect(individualUpdateManySpy).toHaveBeenCalledWith({
					highlights: [],
				});
			});
		});
	});

	describe('delete highlight', () => {
		describe('pass ID of existing highlight', () => {
			it('return deleted highlight', async () => {
				highlightsRepository.deepFindBy = jest.fn().mockReturnValue(HIGHLIGHT_DEEP_MODEL);
				highlightsRepository.delete = jest.fn().mockReturnValue(HIGHLIGHT_MODEL);
				nodesServise.delete = jest
					.fn()
					.mockReturnValueOnce(START_NODE_MODEL)
					.mockReturnValueOnce(END_NODE_MODEL);

				const result = await highlightsService.delete(HIGHLIGHT_MODEL.id);

				expect(result).toEqual(HIGHLIGHT_DEEP_MODEL);
			});
		});

		describe('pass ID of unexisting highlight', () => {
			it('throw error', async () => {
				highlightsRepository.deepFindBy = jest.fn().mockReturnValue(null);

				try {
					await highlightsService.delete(HIGHLIGHT_MODEL.id);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`highlight #${HIGHLIGHT_MODEL.id} not found`);
				}
			});
		});
	});
});
