import { PrismaClient } from '../client';

import { pagesSeeder } from './pages.seeder';
import { highlightsSeeder } from './highlights.seeder';
import { nodesSeeder } from './nodes.seeder';
import { workspacesSeeder } from './workspaces.seeder';

const prisma = new PrismaClient();

async function main(): Promise<void> {
	await prisma.highlightModel.deleteMany();
	await prisma.nodeModel.deleteMany();
	await prisma.pageModel.deleteMany();
	await prisma.workspaceModel.deleteMany();

	await workspacesSeeder(prisma);
	await pagesSeeder(prisma);
	await nodesSeeder(prisma);
	await highlightsSeeder(prisma);
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
