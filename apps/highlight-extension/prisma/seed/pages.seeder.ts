import { PrismaClient } from '~/highlight-extension/prisma/client';

import { PAGE_MODEL } from '../../src/common/stubs/pages';

export async function pagesSeeder(prisma: PrismaClient): Promise<void> {
	await prisma.pageModel.upsert({
		where: { id: PAGE_MODEL.id },
		update: {},
		create: PAGE_MODEL,
	});
	await prisma.pageModel.upsert({
		where: { id: PAGE_MODEL.id + 1 },
		update: {},
		create: {
			id: PAGE_MODEL.id + 1,
			workspaceId: PAGE_MODEL.workspaceId,
			url: 'https://uk.wikipedia.org/wiki/%D0%9A%D0%B2%D0%B5%D0%BD%D1%82%D1%96%D0%BD_%D0%A2%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D1%96%D0%BD%D0%BE',
		},
	});
}
