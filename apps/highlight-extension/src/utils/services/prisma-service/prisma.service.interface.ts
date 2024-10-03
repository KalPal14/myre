import { PrismaClient } from '~/highlight-extension/prisma/client';

export interface IPrismaService {
	client: PrismaClient;

	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
