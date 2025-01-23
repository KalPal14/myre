import 'reflect-metadata';
import { Container } from 'inversify';

import { HTTPError } from '~libs/express-core';

import { NodeModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { Node } from '~/highlight-extension/domain/node/node';
import { INodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository.interface';
import { INodeFactory } from '~/highlight-extension/domain/node/factory/node-factory.interface';
import { NodeFactory } from '~/highlight-extension/domain/node/factory/node.factory';
import { END_NODE_MODEL } from '~/highlight-extension/common/stubs/nodes';

import { INodesService } from './nodes.service.interface';
import { NodesService } from './nodes.service';

const nodesRepositoryMock: INodesRepository = {
	findBy: jest.fn(),
	findManyBy: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

const container = new Container();
let nodesRepository: INodesRepository;
let nodesService: INodesService;

beforeAll(() => {
	container.bind<INodesRepository>(TYPES.NodesRepository).toConstantValue(nodesRepositoryMock);
	container.bind<INodesService>(TYPES.NodesService).to(NodesService);
	container.bind<INodeFactory>(TYPES.NodeFactory).to(NodeFactory);

	nodesRepository = container.get<INodesRepository>(TYPES.NodesRepository);
	nodesService = container.get<INodesService>(TYPES.NodesService);
});

const UPDATE_PAYLOAD: Partial<Node> = {
	text: 'new text',
};

describe('NodesService', () => {
	describe('update node', () => {
		describe('pass existing node ID', () => {
			it('return updated node', async () => {
				nodesRepository.findBy = jest.fn().mockReturnValue(END_NODE_MODEL);
				nodesRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<Node>): NodeModel => ({
						...END_NODE_MODEL,
						id,
						...payload,
					})
				);

				const result = await nodesService.update(END_NODE_MODEL.id, UPDATE_PAYLOAD);

				expect(result).toEqual({ ...END_NODE_MODEL, ...UPDATE_PAYLOAD });
			});
		});

		describe('pass unexisting node ID', () => {
			it('throw error', async () => {
				nodesRepository.findBy = jest.fn().mockReturnValue(null);

				try {
					await nodesService.update(END_NODE_MODEL.id, UPDATE_PAYLOAD);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`node #${END_NODE_MODEL.id} not found`);
				}
			});
		});
	});

	describe('delete node', () => {
		describe('pass existing node ID', () => {
			it('return deleted node', async () => {
				nodesRepository.findBy = jest.fn().mockReturnValue(END_NODE_MODEL);
				nodesRepository.delete = jest.fn().mockReturnValue(END_NODE_MODEL);

				const result = await nodesService.delete(END_NODE_MODEL.id);

				expect(result).toEqual(END_NODE_MODEL);
			});
		});

		describe('pass unexisting node ID', () => {
			it('throw error', async () => {
				nodesRepository.findBy = jest.fn().mockReturnValue(null);

				try {
					await nodesService.delete(END_NODE_MODEL.id);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`node #${END_NODE_MODEL.id} not found`);
				}
			});
		});
	});
});
