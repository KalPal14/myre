import { NodeModel } from '~/highlight-extension/prisma/client';
import { Node } from '~/highlight-extension/domain/node/node';

export interface INodesService {
	getNode: (id: number) => Promise<NodeModel | null>;
	createNode: (nodeData: Node) => Promise<NodeModel>;
	updateNode: (id: number, payload: Partial<Node>) => Promise<NodeModel | Error>;
	deleteNode: (id: number) => Promise<NodeModel | Error>;
}
