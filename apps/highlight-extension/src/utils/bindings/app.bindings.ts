import { ContainerModule, interfaces } from 'inversify';

import App from '~/highlight-extension/app';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { PrismaService } from '~/highlight-extension/utils/services/prisma-service/prisma.service';
import { IPrismaService } from '~/highlight-extension/utils/services/prisma-service/prisma.service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
});
