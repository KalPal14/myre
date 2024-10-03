import { PrismaClient } from '~/highlight-extension/prisma/client';

import { RIGHT_START_NODE, RIGHT_END_NODE } from '../../src/common/constants/spec/nodes';

export async function nodesSeed(prisma: PrismaClient): Promise<void> {
	const startNode1 = await prisma.nodeModel.upsert({
		where: { id: RIGHT_START_NODE.id },
		update: {},
		create: {
			text: RIGHT_START_NODE.text,
			indexNumber: RIGHT_START_NODE.indexNumber,
			sameElementsAmount: RIGHT_START_NODE.sameElementsAmount,
		},
	});
	const endNode1 = await prisma.nodeModel.upsert({
		where: { id: RIGHT_END_NODE.id },
		update: {},
		create: {
			text: RIGHT_END_NODE.text,
			indexNumber: RIGHT_END_NODE.indexNumber,
			sameElementsAmount: RIGHT_END_NODE.sameElementsAmount,
		},
	});
	console.log({ startNode1, endNode1 });
}
