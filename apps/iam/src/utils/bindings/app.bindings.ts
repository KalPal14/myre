import { ContainerModule, interfaces } from 'inversify';

import App from '~/iam/app';
import { TYPES } from '~/iam/common/constants/types';
import { PrismaService } from '~/iam/utils/services/prisma-service/prisma.service';
import { IPrismaService } from '~/iam/utils/services/prisma-service/prisma.service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
});
