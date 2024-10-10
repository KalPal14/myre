import { NodeModel } from '~/highlight-extension/prisma/client';
import { Node } from '~/highlight-extension/domain/node/node';

export interface INodesRepository {
	create: (node: Node) => Promise<NodeModel>;
	update: (id: number, payload: Partial<Node>) => Promise<NodeModel>;
	findById: (id: number) => Promise<NodeModel | null>;
	delete: (id: number) => Promise<NodeModel>;
}
