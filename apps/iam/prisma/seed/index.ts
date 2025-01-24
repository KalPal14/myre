import { PrismaClient } from '../client';

import { usersSeeder } from './users.seeder';

const prisma = new PrismaClient();

async function main(): Promise<void> {
	await prisma.userModel.deleteMany();

	await usersSeeder(prisma);
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
