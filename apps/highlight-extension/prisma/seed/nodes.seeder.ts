import { PrismaClient } from '~/highlight-extension/prisma/client';

import { START_NODE_MODEL, END_NODE_MODEL } from '../../src/common/stubs/nodes';

export async function nodesSeeder(prisma: PrismaClient): Promise<void> {
	await prisma.nodeModel.upsert({
		where: { id: START_NODE_MODEL.id },
		update: {},
		create: START_NODE_MODEL,
	});
	await prisma.nodeModel.upsert({
		where: { id: END_NODE_MODEL.id },
		update: {},
		create: END_NODE_MODEL,
	});
}
