import { ContainerModule, interfaces } from 'inversify';

import { PrismaService, IPrismaService } from '~libs/express-core';

import App from '~/iam/app';
import { TYPES } from '~/iam/common/constants/types';
import { PrismaClient } from '~/iam/prisma/client';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
});
