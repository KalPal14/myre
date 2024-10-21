import { inject, injectable } from 'inversify';

import { HTTPError } from '~libs/express-core';

import { NodeModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { Node } from '~/highlight-extension/domain/node/node';
import { INodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository.interface';

import { INodesService } from './nodes.service.interface';

@injectable()
export class NodesService implements INodesService {
	constructor(@inject(TYPES.NodesRepository) private nodesRepository: INodesRepository) {}

	async get(id: number): Promise<NodeModel> {
		const page = await this.nodesRepository.findBy({ id });
		if (!page) {
			throw new HTTPError(402, `node #${id} not found`);
		}

		return page;
	}

	create(nodeData: Node): Promise<NodeModel> {
		return this.nodesRepository.create(nodeData);
	}

	async update(id: number, payload: Partial<Node>): Promise<NodeModel> {
		await this.get(id);
		return this.nodesRepository.update(id, payload);
	}

	async delete(id: number): Promise<NodeModel> {
		await this.get(id);
		return this.nodesRepository.delete(id);
	}
}
