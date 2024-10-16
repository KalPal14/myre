import { PrismaClient } from '~/highlight-extension/prisma/client';

import { WORKSPACE, WORKSPACE_MODEL } from '../../src/common/constants/spec/workspaces';

export async function workspacesSeed(prisma: PrismaClient): Promise<void> {
	await prisma.workspaceModel.upsert({
		where: { id: WORKSPACE_MODEL.id },
		update: {},
		create: WORKSPACE,
	});
	await prisma.workspaceModel.upsert({
		where: { id: WORKSPACE_MODEL.id + 1 },
		update: {},
		create: WORKSPACE,
	});
}
