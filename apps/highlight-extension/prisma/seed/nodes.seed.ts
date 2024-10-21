import { PrismaClient } from '~/highlight-extension/prisma/client';

import {
	START_NODE_MODEL,
	END_NODE_MODEL,
	START_NODE,
	END_NODE,
} from '../../src/common/constants/spec/nodes';

export async function nodesSeed(prisma: PrismaClient): Promise<void> {
	await prisma.nodeModel.upsert({
		where: { id: START_NODE_MODEL.id },
		update: {},
		create: START_NODE,
	});
	await prisma.nodeModel.upsert({
		where: { id: END_NODE_MODEL.id },
		update: {},
		create: END_NODE,
	});
}
