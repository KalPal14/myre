import { inject, injectable } from 'inversify';

import { NodeModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { Node } from '~/highlight-extension/domain/node/node';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';

import { INodesRepository } from './nodes.repository.interface';

@injectable()
export class NodesRepository implements INodesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	findBy(findData: Partial<NodeModel>): Promise<NodeModel | null> {
		return this.prismaService.client.nodeModel.findFirst({
			where: findData,
		});
	}

	findManyBy(findData: Partial<NodeModel>): Promise<NodeModel[]> {
		return this.prismaService.client.nodeModel.findMany({
			where: findData,
		});
	}

	create(node: Node): Promise<NodeModel> {
		return this.prismaService.client.nodeModel.create({
			data: node,
		});
	}

	update(id: number, payload: Partial<Node>): Promise<NodeModel> {
		return this.prismaService.client.nodeModel.update({
			where: { id },
			data: payload,
		});
	}

	delete(id: number): Promise<NodeModel> {
		return this.prismaService.client.nodeModel.delete({
			where: { id },
		});
	}
}
