export interface IBasePrismaService<GeneratedPrismaClient> {
	client: GeneratedPrismaClient;

	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}
