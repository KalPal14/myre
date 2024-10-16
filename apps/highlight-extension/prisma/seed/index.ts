import { PrismaClient } from '../client';

import { pagesSeed } from './pages.seed';
import { highlightsSeed } from './highlights.seed';
import { nodesSeed } from './nodes.seed';
import { workspacesSeed } from './workspaces.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
	await workspacesSeed(prisma);
	await pagesSeed(prisma);
	await nodesSeed(prisma);
	await highlightsSeed(prisma);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
