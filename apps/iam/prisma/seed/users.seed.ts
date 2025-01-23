import { hash } from 'bcryptjs';

import { USER, USER_MODEL } from '../../src/common/stubs/users';
import { PrismaClient } from '../client';

const salt = Number(process.env.SALT);

export async function usersSeed(prisma: PrismaClient): Promise<void> {
	await prisma.userModel.upsert({
		where: { id: USER_MODEL.id },
		update: {},
		create: {
			...USER,
			password: await hash(USER.password, salt),
		},
	});
	await prisma.userModel.upsert({
		where: { id: USER_MODEL.id + 1 },
		update: {},
		create: {
			email: 'alex@test.com',
			username: 'alex',
			password: await hash('123123', salt),
			passwordUpdatedAt: null,
		},
	});
}
