import { PrismaClient } from '@orm/client';

export interface IPrismaService {
	client: PrismaClient;

	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
