import { ContainerModule, interfaces } from 'inversify';

import { PrismaService } from '~libs/express-core';

import App from '~/highlight-extension/app';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { PrismaClient } from '~/highlight-extension/prisma/client';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());
	bind<TPrismaService>(TYPES.PrismaService).to(PrismaService);
});
