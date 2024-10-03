import 'reflect-metadata';
import { Container } from 'inversify';

import { NodeModel } from '~/highlight-extension/prisma/client';
import {
	RIGHT_END_NODE,
	UPDATED_END_NODE,
	WRONG_NODE,
} from '~/highlight-extension/common/constants/spec/nodes';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { INode } from '~/highlight-extension/entities/node-entity/node.entity.interface';
import { INodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository.interface';

import { INodesService } from './nodes.service.interface';
import { NodesService } from './nodes.service';

const nodesRepositoryMock: INodesRepository = {
	create: jest.fn(),
	update: jest.fn(),
	findById: jest.fn(),
	delete: jest.fn(),
};

const container = new Container();
let nodesRepository: INodesRepository;
let nodesService: INodesService;

beforeAll(() => {
	container.bind<INodesRepository>(TYPES.NodesRepository).toConstantValue(nodesRepositoryMock);
	container.bind<INodesService>(TYPES.NodesService).to(NodesService);

	nodesRepository = container.get<INodesRepository>(TYPES.NodesRepository);
	nodesService = container.get<INodesService>(TYPES.NodesService);
});

describe('Nodes Service', () => {
	it('update node - success', async () => {
		nodesRepository.findById = jest.fn().mockReturnValue(RIGHT_END_NODE);
		nodesRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<INode>): NodeModel => ({
				...RIGHT_END_NODE,
				...payload,
			})
		);

		const result = await nodesService.updateNode(RIGHT_END_NODE.id, {
			text: UPDATED_END_NODE.text,
			sameElementsAmount: UPDATED_END_NODE.sameElementsAmount,
		});

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result).toEqual(UPDATED_END_NODE);
	});

	it('update node - wrong: there is no node with this id', async () => {
		nodesRepository.findById = jest.fn().mockReturnValue(null);
		nodesRepository.update = jest.fn().mockImplementation(
			(id: number, payload: Partial<INode>): NodeModel => ({
				...RIGHT_END_NODE,
				...payload,
			})
		);

		const result = await nodesService.updateNode(WRONG_NODE.id, {
			text: UPDATED_END_NODE.text,
			sameElementsAmount: UPDATED_END_NODE.sameElementsAmount,
		});

		expect(result).toBeInstanceOf(Error);
	});

	it('delete node - success', async () => {
		nodesRepository.findById = jest.fn().mockReturnValue(RIGHT_END_NODE);
		nodesRepository.delete = jest.fn().mockReturnValue(RIGHT_END_NODE);

		const result = await nodesService.deleteNode(RIGHT_END_NODE.id);

		expect(result).not.toBeInstanceOf(Error);
		if (result instanceof Error) return;
		expect(result).toEqual(RIGHT_END_NODE);
	});

	it('delete node - wrong: there is no node with this id', async () => {
		nodesRepository.findById = jest.fn().mockReturnValue(null);
		nodesRepository.delete = jest.fn().mockReturnValue(RIGHT_END_NODE);

		const result = await nodesService.deleteNode(RIGHT_END_NODE.id);

		expect(result).toBeInstanceOf(Error);
	});
});
