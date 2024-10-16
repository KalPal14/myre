import 'reflect-metadata';
import { Container } from 'inversify';

import {
	RIGHT_HIGHLIGHT,
	UPDATED_HIGHLIGHT,
	WRONG_HIGHLIGHT,
} from '~/highlight-extension/common/constants/spec/highlights';
import {
	RIGHT_START_NODE,
	RIGHT_END_NODE,
	UPDATED_END_NODE,
} from '~/highlight-extension/common/constants/spec/nodes';
import { RIGHT_PAGE } from '~/highlight-extension/common/constants/spec/pages';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { THighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.type';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';
import { IHighlightFactory } from '~/highlight-extension/domain/highlight/factory/highlight-factory.interface';
import { HighlightFactory } from '~/highlight-extension/domain/highlight/factory/highlight.factory';
import { WORKSPACE_MODEL } from '~/highlight-extension/common/constants/spec/workspaces';

import { IPagesServise } from '../pages-service/pages.service.interface';
import { INodesService } from '../nodes-service/nodes.service.interface';

import { HighlightsService } from './highlights.service';
import { IHighlightsService } from './highlights.service.interface';

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
const pagesRepositoryMock: IPagesRepository = {
	create: jest.fn(),
	update: jest.fn(),
	findByUrl: jest.fn(),
	findById: jest.fn(),
	findAll: jest.fn(),
	delete: jest.fn(),
};
const pagesServiseMock: IPagesServise = {
	createPage: jest.fn(),
	updatePage: jest.fn(),
	getPageInfo: jest.fn(),
	getPagesInfo: jest.fn(),
};
const nodesServiseMock: INodesService = {
	createNode: jest.fn(),
	updateNode: jest.fn(),
	deleteNode: jest.fn(),
	getNode: jest.fn(),
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

describe('Highlights Service', () => {
	it('create highlight - success: highlight without note for new page', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		pagesRepository.findByUrl = jest.fn().mockReturnValue(null);
		pagesServise.createPage = jest.fn().mockReturnValue(RIGHT_PAGE);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): THighlightDeepModel => ({
				id: RIGHT_HIGHLIGHT.id,
				...highlight,
				startContainer: RIGHT_START_NODE,
				endContainer: RIGHT_END_NODE,
			})
		);
		nodesServise.createNode = jest
			.fn()
			.mockReturnValueOnce(RIGHT_START_NODE)
			.mockReturnValueOnce(RIGHT_END_NODE);
		const createNodeSpy = jest.spyOn(nodesServise, 'createNode');

		const result = await highlightsService.createHighlight({
			workspaceId: WORKSPACE_MODEL.id,
			pageUrl: RIGHT_PAGE.url,
			startContainer: START_NODE,
			endContainer: END_NODE,
			startOffset: RIGHT_HIGHLIGHT.startOffset,
			endOffset: RIGHT_HIGHLIGHT.endOffset,
			text: RIGHT_HIGHLIGHT.text,
			color: RIGHT_HIGHLIGHT.color,
		});

		expect(createNodeSpy).toHaveBeenCalledTimes(2);
		expect(result).toEqual({
			...RIGHT_HIGHLIGHT,
			startContainer: RIGHT_START_NODE,
			endContainer: RIGHT_END_NODE,
			note: null,
		});
	});
	it('create highlight - success: highlight with note for an existing page', async () => {
		const { id: _stid, ...START_NODE } = RIGHT_START_NODE;
		const { id: _endid, ...END_NODE } = RIGHT_END_NODE;
		pagesRepository.findByUrl = jest.fn().mockReturnValue(RIGHT_PAGE);
		pagesServise.createPage = jest.fn().mockReturnValue(Error);
		highlightsRepository.create = jest.fn().mockImplementation(
			(highlight: Highlight): THighlightDeepModel => ({
				id: RIGHT_HIGHLIGHT.id,
				...highlight,
				startContainer: RIGHT_START_NODE,
				endContainer: RIGHT_END_NODE,
			})
		);
		nodesServise.createNode = jest
			.fn()
			.mockReturnValueOnce(RIGHT_START_NODE)
			.mockReturnValueOnce(RIGHT_END_NODE);
		const createNodeSpy = jest.spyOn(nodesServise, 'createNode');

		const result = await highlightsService.createHighlight({
			workspaceId: WORKSPACE_MODEL.id,
			pageUrl: RIGHT_PAGE.url,
			startContainer: START_NODE,
			endContainer: END_NODE,
			startOffset: RIGHT_HIGHLIGHT.startOffset,
			endOffset: RIGHT_HIGHLIGHT.endOffset,
			text: RIGHT_HIGHLIGHT.text,
			color: RIGHT_HIGHLIGHT.color,
			note: RIGHT_HIGHLIGHT.note as string,
		});

		expect(createNodeSpy).toHaveBeenCalledTimes(2);
		expect(result).toEqual({
			...RIGHT_HIGHLIGHT,
			startContainer: RIGHT_START_NODE,
			endContainer: RIGHT_END_NODE,
		});
	});

	it('update highlight - success: update highlight and one node', async () => {
		const { id: _endid, ...UPDATED_END_NODE_DATA } = UPDATED_END_NODE;
		nodesServise.updateNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue({
			...RIGHT_HIGHLIGHT,
			startContainer: RIGHT_START_NODE,
			endContainer: RIGHT_END_NODE,
		});
		highlightsRepository.update = jest.fn();
		const updateNodeSpy = jest.spyOn(nodesServise, 'updateNode');
		const updateHighlightSpy = jest.spyOn(highlightsRepository, 'update');

		const result = await highlightsService.updateHighlight(RIGHT_HIGHLIGHT.id, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			text: UPDATED_HIGHLIGHT.text,
			color: UPDATED_HIGHLIGHT.color,
			endOffset: UPDATED_HIGHLIGHT.endOffset,
			endContainer: UPDATED_END_NODE_DATA,
		});

		expect(result).not.toBeInstanceOf(Error);
		expect(updateNodeSpy).toHaveBeenCalledWith(
			RIGHT_HIGHLIGHT.endContainerId,
			UPDATED_END_NODE_DATA
		);
		expect(updateHighlightSpy).toHaveBeenCalledWith(RIGHT_HIGHLIGHT.id, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			text: UPDATED_HIGHLIGHT.text,
			color: UPDATED_HIGHLIGHT.color,
			endOffset: UPDATED_HIGHLIGHT.endOffset,
		});
	});

	it('update highlight - success: update highlight only', async () => {
		const { id: _endid, ..._ } = UPDATED_END_NODE;
		nodesServise.updateNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue({
			...RIGHT_HIGHLIGHT,
			startContainer: RIGHT_START_NODE,
			endContainer: RIGHT_END_NODE,
		});
		highlightsRepository.update = jest.fn();
		const updateNodeSpy = jest.spyOn(nodesServise, 'updateNode');
		const updateHighlightSpy = jest.spyOn(highlightsRepository, 'update');

		const result = await highlightsService.updateHighlight(RIGHT_HIGHLIGHT.id, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			color: UPDATED_HIGHLIGHT.color,
		});

		expect(result).not.toBeInstanceOf(Error);
		expect(updateNodeSpy).toHaveBeenCalledTimes(0);
		expect(updateHighlightSpy).toHaveBeenCalledWith(RIGHT_HIGHLIGHT.id, {
			note: UPDATED_HIGHLIGHT.note,
			color: UPDATED_HIGHLIGHT.color,
		});
	});

	it('update highlight - success: update only one node', async () => {
		const { id: _endid, ...UPDATED_END_NODE_DATA } = UPDATED_END_NODE;
		nodesServise.updateNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue({
			...RIGHT_HIGHLIGHT,
			startContainer: RIGHT_START_NODE,
			endContainer: RIGHT_END_NODE,
		});
		highlightsRepository.update = jest.fn();
		const updateNodeSpy = jest.spyOn(nodesServise, 'updateNode');
		const updateHighlightSpy = jest.spyOn(highlightsRepository, 'update');

		const result = await highlightsService.updateHighlight(RIGHT_HIGHLIGHT.id, {
			endContainer: UPDATED_END_NODE_DATA,
		});

		expect(result).not.toBeInstanceOf(Error);
		expect(updateNodeSpy).toHaveBeenCalledWith(
			RIGHT_HIGHLIGHT.endContainerId,
			UPDATED_END_NODE_DATA
		);
		expect(updateHighlightSpy).toHaveBeenCalledTimes(0);
	});

	it('update highlight - wrong: no highlight with this ID', async () => {
		nodesServise.updateNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue(null);
		highlightsRepository.update = jest.fn();

		const result = await highlightsService.updateHighlight(WRONG_HIGHLIGHT.id!, {
			note: UPDATED_HIGHLIGHT.note as string | undefined,
			text: UPDATED_HIGHLIGHT.text,
			color: UPDATED_HIGHLIGHT.color,
		});

		expect(result).toBeInstanceOf(Error);
	});

	it('individual update highlights - success: called with one unexisting highlight', async () => {
		highlightsRepositoryMock.findAllByIds = jest.fn().mockReturnValue([RIGHT_HIGHLIGHT]);
		const individualUpdateManySpy = jest.spyOn(highlightsRepositoryMock, 'individualUpdateMany');

		await highlightsService.individualUpdateHighlights({
			highlights: [
				{
					id: WRONG_HIGHLIGHT.id!,
					payload: {
						text: UPDATED_HIGHLIGHT.text,
					},
				},
				{
					id: RIGHT_HIGHLIGHT.id,
					payload: {
						text: UPDATED_HIGHLIGHT.text,
					},
				},
			],
		});

		expect(individualUpdateManySpy).toHaveBeenCalledWith({
			highlights: [
				{
					id: RIGHT_HIGHLIGHT.id,
					payload: {
						text: UPDATED_HIGHLIGHT.text,
					},
				},
			],
		});
	});

	it('individual update highlights - success: called with all unexisting highlights', async () => {
		highlightsRepositoryMock.findAllByIds = jest.fn().mockReturnValue([]);
		const individualUpdateManySpy = jest.spyOn(highlightsRepositoryMock, 'individualUpdateMany');

		await highlightsService.individualUpdateHighlights({
			highlights: [
				{
					id: WRONG_HIGHLIGHT.id!,
					payload: {
						text: UPDATED_HIGHLIGHT.text,
					},
				},
				{
					id: RIGHT_HIGHLIGHT.id,
					payload: {
						text: UPDATED_HIGHLIGHT.text,
					},
				},
			],
		});

		expect(individualUpdateManySpy).toHaveBeenCalledWith({
			highlights: [],
		});
	});

	it('delete highlight - success', async () => {
		nodesServise.deleteNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue({
			...RIGHT_HIGHLIGHT,
			startContainer: RIGHT_START_NODE,
			endContainer: RIGHT_END_NODE,
		});
		highlightsRepository.delete = jest.fn().mockReturnValue(RIGHT_HIGHLIGHT);
		const deleteNodeSpy = jest.spyOn(nodesServise, 'deleteNode');

		const result = await highlightsService.deleteHighlight(RIGHT_HIGHLIGHT.id);

		expect(result).toEqual(RIGHT_HIGHLIGHT);
		expect(deleteNodeSpy).toHaveBeenCalledTimes(2);
	});
	it('delete highlight - wrong:  no highlight with this ID', async () => {
		nodesServise.deleteNode = jest.fn();
		highlightsRepository.findById = jest.fn().mockReturnValue(null);
		highlightsRepository.delete = jest.fn();

		const result = await highlightsService.deleteHighlight(RIGHT_HIGHLIGHT.id);

		expect(result).toBeInstanceOf(Error);
	});
});
