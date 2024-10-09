import { ContainerModule, interfaces } from 'inversify';

import { PrismaService } from '~libs/express-core';

import App from '~/iam/app';
import { TYPES } from '~/iam/common/constants/types';
import { PrismaClient } from '~/iam/prisma/client';
import { TPrismaService } from '~/iam/common/types/prisma-service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());
	bind<TPrismaService>(TYPES.PrismaService).to(PrismaService);
});
