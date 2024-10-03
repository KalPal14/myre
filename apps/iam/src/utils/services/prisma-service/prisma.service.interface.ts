import { PrismaClient } from '~/iam/prisma/client';

export interface IPrismaService {
	client: PrismaClient;

	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
