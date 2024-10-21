import { NodeModel } from '~/highlight-extension/prisma/client';
import { Node } from '~/highlight-extension/domain/node/node';

export interface INodesService {
	get: (id: number) => Promise<NodeModel | null>;
	create: (nodeData: Node) => Promise<NodeModel>;
	update: (id: number, payload: Partial<Node>) => Promise<NodeModel>;
	delete: (id: number) => Promise<NodeModel>;
}
