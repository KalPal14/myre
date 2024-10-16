import { PrismaClient } from '~/highlight-extension/prisma/client';

import { WORKSPACE_MODEL } from '../../src/common/constants/spec/workspaces';
import { RIGHT_PAGE } from '../../src/common/constants/spec/pages';

export async function pagesSeed(prisma: PrismaClient): Promise<void> {
	await prisma.pageModel.upsert({
		where: { id: RIGHT_PAGE.id },
		update: {},
		create: {
			workspaceId: WORKSPACE_MODEL.id,
			url: RIGHT_PAGE.url,
		},
	});
	await prisma.pageModel.upsert({
		where: { id: RIGHT_PAGE.id + 1 },
		update: {},
		create: {
			workspaceId: WORKSPACE_MODEL.id,
			url: 'https://uk.wikipedia.org/wiki/%D0%9A%D0%B2%D0%B5%D0%BD%D1%82%D1%96%D0%BD_%D0%A2%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D1%96%D0%BD%D0%BE',
		},
	});
}
