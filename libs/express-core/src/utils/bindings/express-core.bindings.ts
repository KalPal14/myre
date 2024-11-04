import { ContainerModule, interfaces } from 'inversify';

import {
	ConfigService,
	EXPRESS_CORE_TYPES,
	IConfigService,
	IJwtService,
	IMiddleware,
	JwtAuthMiddleware,
	JwtService,
} from '~libs/express-core';
import { ExceptionFilter } from '~libs/express-core/exceptions/exception-filter/exception.filter';
import { IExceptionFilter } from '~libs/express-core/exceptions/exception-filter/exception.filter.interface';
import { LoggerService } from '~libs/express-core/services/logger-service/logger.service';
import { ILogger } from '~libs/express-core/services/logger-service/logger.service.interface';

export const expressCoreBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IConfigService>(EXPRESS_CORE_TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<ILogger>(EXPRESS_CORE_TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IJwtService>(EXPRESS_CORE_TYPES.JwtService).to(JwtService).inSingletonScope();
	bind<IExceptionFilter>(EXPRESS_CORE_TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IMiddleware>(EXPRESS_CORE_TYPES.JwtAuthMiddleware).to(JwtAuthMiddleware);
});
