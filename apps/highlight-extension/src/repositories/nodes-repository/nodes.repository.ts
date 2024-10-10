import { inject, injectable } from 'inversify';

import { NodeModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { Node } from '~/highlight-extension/domain/node/node';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';

import { INodesRepository } from './nodes.repository.interface';

@injectable()
export class NodesRepository implements INodesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	async create({ text, indexNumber, sameElementsAmount }: Node): Promise<NodeModel> {
		return await this.prismaService.client.nodeModel.create({
			data: {
				text,
				indexNumber,
				sameElementsAmount,
			},
		});
	}

	async update(id: number, payload: Partial<Node>): Promise<NodeModel> {
		return await this.prismaService.client.nodeModel.update({
			where: { id },
			data: {
				...payload,
			},
		});
	}

	async findById(id: number): Promise<NodeModel | null> {
		return await this.prismaService.client.nodeModel.findFirst({
			where: { id },
		});
	}

	async delete(id: number): Promise<NodeModel> {
		return await this.prismaService.client.nodeModel.delete({
			where: { id },
		});
	}
}
