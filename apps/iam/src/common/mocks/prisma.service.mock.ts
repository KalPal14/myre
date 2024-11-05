import { prismaEntityMock } from '~libs/common';

const prismaClientMock = {
	userModel: prismaEntityMock,
	$transaction: jest.fn().mockImplementation((callback) => callback(prismaClientMock)),
};

export const prismaServiceMock = {
	client: prismaClientMock,
};
