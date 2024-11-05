export const prismaEntityMock = {
	findFirst: jest.fn(),
	findFirstOrThrow: jest.fn(),
	findUnique: jest.fn(),
	findUniqueOrThrow: jest.fn(),
	findMany: jest.fn(),

	create: jest.fn(),
	createMany: jest.fn(),

	update: jest.fn(),
	updateMany: jest.fn(),

	delete: jest.fn(),
	deleteMany: jest.fn(),

	upsert: jest.fn(),
};
