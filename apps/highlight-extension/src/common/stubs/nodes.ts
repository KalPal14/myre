import { Node } from '~/highlight-extension/domain/node/node';
import { NodeModel } from '~/highlight-extension/prisma/client';

export const START_NODE: Node = {
	text: ' between two models in the Prisma schema. For example, there is a one-to-many relation between ',
	indexNumber: 0,
	sameElementsAmount: 1,
};

export const START_NODE_MODEL: NodeModel = {
	id: 1,
	...START_NODE,
};

export const END_NODE: Node = {
	text: 'Post',
	indexNumber: 0,
	sameElementsAmount: 20,
};

export const END_NODE_MODEL: NodeModel = {
	id: 2,
	...END_NODE,
};
