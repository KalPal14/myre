import { PrismaClient } from '~/highlight-extension/prisma/client';

import { WORKSPACE_MODEL } from '../../src/common/stubs/workspaces';

export async function workspacesSeeder(prisma: PrismaClient): Promise<void> {
	await prisma.workspaceModel.upsert({
		where: { id: WORKSPACE_MODEL.id },
		update: {},
		create: WORKSPACE_MODEL,
	});
	await prisma.workspaceModel.upsert({
		where: { id: WORKSPACE_MODEL.id + 1 },
		update: {},
		create: { ...WORKSPACE_MODEL, id: WORKSPACE_MODEL.id + 1 },
	});
}
