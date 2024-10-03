import { ContainerModule, interfaces } from 'inversify';

import { EXPRESS_CORE_TYPES } from '~libs/express-core';
import { ExceptionFilter } from '~libs/express-core/exceptions/exception-filter/exception.filter';
import { IExceptionFilter } from '~libs/express-core/exceptions/exception-filter/exception.filter.interface';
import { ConfigService } from '~libs/express-core/services/config-service/config.service';
import { IConfigService } from '~libs/express-core/services/config-service/config.service.interface';
import { LoggerService } from '~libs/express-core/services/logger-service/logger.service';
import { ILogger } from '~libs/express-core/services/logger-service/logger.service.interface';

export const expressCoreBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(EXPRESS_CORE_TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IConfigService>(EXPRESS_CORE_TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(EXPRESS_CORE_TYPES.ExceptionFilter).to(ExceptionFilter);
});
