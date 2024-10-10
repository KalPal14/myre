import { inject, injectable } from 'inversify';

import { NodeModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { Node } from '~/highlight-extension/domain/node/node';
import { INodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository.interface';

import { INodesService } from './nodes.service.interface';

@injectable()
export class NodesService implements INodesService {
	constructor(@inject(TYPES.NodesRepository) private nodesRepository: INodesRepository) {}

	async getNode(id: number): Promise<NodeModel | null> {
		return await this.nodesRepository.findById(id);
	}

	async createNode(nodeData: Node): Promise<NodeModel> {
		return await this.nodesRepository.create(nodeData);
	}

	async updateNode(id: number, payload: Partial<Node>): Promise<NodeModel | Error> {
		const existingNode = await this.nodesRepository.findById(id);
		if (!existingNode) {
			return Error('There is no node with this ID');
		}

		return this.nodesRepository.update(existingNode.id, payload);
	}

	async deleteNode(id: number): Promise<NodeModel | Error> {
		const existingNode = await this.nodesRepository.findById(id);
		if (!existingNode) {
			return Error('There is no node with this ID');
		}

		return this.nodesRepository.delete(id);
	}
}
