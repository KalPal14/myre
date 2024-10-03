import { NodeModel } from '~/highlight-extension/prisma/client';

export const RIGHT_START_NODE: NodeModel = {
	id: 1,
	text: ' between two models in the Prisma schema. For example, there is a one-to-many relation between ',
	indexNumber: 0,
	sameElementsAmount: 1,
};

export const RIGHT_END_NODE: NodeModel = {
	id: 2,
	text: 'Post',
	indexNumber: 0,
	sameElementsAmount: 20,
};

export const UPDATED_END_NODE: NodeModel = {
	id: RIGHT_END_NODE.id,
	text: ' because one user can have many blog posts.',
	indexNumber: 0,
	sameElementsAmount: 1,
};

export const WRONG_NODE: NodeModel = {
	id: -1,
	text: 'wrong!!! wrong!!!',
	indexNumber: 0,
	sameElementsAmount: 1,
};
