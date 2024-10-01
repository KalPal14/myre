import { ContainerModule, interfaces } from 'inversify';

import App from '@/app';
import TYPES from '@/common/constants/types.inversify';
import { ExceptionFilter } from '@/exceptions/exception-filter/exception.filter';
import { IExceptionFilter } from '@/exceptions/exception-filter/exception.filter.interface';
import { ConfigService } from '@/utils/services/config-service/config.service';
import { IConfigService } from '@/utils/services/config-service/config.service.interface';
import { LoggerService } from '@/utils/services/logger-service/logger.service';
import { ILogger } from '@/utils/services/logger-service/logger.service.interface';
import { PrismaService } from '@/utils/services/prisma-service/prisma.service';
import { IPrismaService } from '@/utils/services/prisma-service/prisma.service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.App).to(App);
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IPrismaService>(TYPES.PrismaService).to(PrismaService);
});
