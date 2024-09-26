import { NodeModel } from '@prisma/client';

import { INode } from '@/entities/node-entity/node.entity.interface';

export interface INodesService {
	getNode: (id: number) => Promise<NodeModel | null>;
	createNode: (nodeData: INode) => Promise<NodeModel>;
	updateNode: (id: number, payload: Partial<INode>) => Promise<NodeModel | Error>;
	deleteNode: (id: number) => Promise<NodeModel | Error>;
}
