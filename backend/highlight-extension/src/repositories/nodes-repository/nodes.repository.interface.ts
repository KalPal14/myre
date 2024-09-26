import { NodeModel } from '@prisma/client';

import { INode } from '@/entities/node-entity/node.entity.interface';

export interface INodesRepository {
	create: (node: INode) => Promise<NodeModel>;
	update: (id: number, payload: Partial<INode>) => Promise<NodeModel>;
	findById: (id: number) => Promise<NodeModel | null>;
	delete: (id: number) => Promise<NodeModel>;
}
