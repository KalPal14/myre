import { ContainerModule, interfaces } from 'inversify';

import { PrismaService, IPrismaService } from '~libs/express-core';

import App from '~/highlight-extension/app';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { PrismaClient } from '~/highlight-extension/prisma/client';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
});
