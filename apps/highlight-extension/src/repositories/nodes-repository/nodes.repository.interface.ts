import { NodeModel } from '~/highlight-extension/prisma/client';
import { Node } from '~/highlight-extension/domain/node/node';

export interface INodesRepository {
	findBy: (findData: Partial<NodeModel>) => Promise<NodeModel | null>;
	findManyBy: (findData: Partial<NodeModel>) => Promise<NodeModel[]>;

	create: (node: Node) => Promise<NodeModel>;
	update: (id: number, payload: Partial<Node>) => Promise<NodeModel>;
	delete: (id: number) => Promise<NodeModel>;
}
