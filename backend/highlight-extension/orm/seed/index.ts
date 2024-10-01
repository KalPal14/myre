import { PrismaClient } from '../client';

import { usersSeed } from './users.seed';
import { pagesSeed } from './pages.seed';
import { highlightsSeed } from './highlights.seed';
import { nodesSeed } from './nodes.seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
	await usersSeed(prisma);
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
