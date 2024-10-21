import { PrismaClient } from '~/highlight-extension/prisma/client';

import { HIGHLIGHT, HIGHLIGHT_MODEL } from '../../src/common/constants/spec/highlights';

export async function highlightsSeed(prisma: PrismaClient): Promise<void> {
	await prisma.highlightModel.upsert({
		where: { id: HIGHLIGHT_MODEL.id },
		update: {},
		create: HIGHLIGHT,
	});
}
