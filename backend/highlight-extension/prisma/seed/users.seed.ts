import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

import { RIGHT_USER } from '../../src/common/constants/spec/users';

const salt = Number(process.env.SALT);

export async function usersSeed(prisma: PrismaClient): Promise<void> {
	const user1 = await prisma.userModel.upsert({
		where: { email: RIGHT_USER.email },
		update: {},
		create: {
			email: RIGHT_USER.email,
			username: RIGHT_USER.username,
			password: await hash(RIGHT_USER.password, salt),
			passwordUpdatedAt: null,
			colors: [],
		},
	});
	const user2 = await prisma.userModel.upsert({
		where: { email: 'bob@test.com' },
		update: {},
		create: {
			email: 'bob@test.com',
			username: 'bob_test',
			password: await hash('123123', salt),
			passwordUpdatedAt: null,
			colors: [],
		},
	});
	console.log({ user1, user2 });
}
