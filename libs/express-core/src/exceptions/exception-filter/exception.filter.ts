import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { ILogger } from '~libs/express-core/services/logger-service/logger.service.interface';
import { EXPRESS_CORE_TYPES } from '~libs/express-core';

import { HTTPError } from '../http-error.class';

import { IExceptionFilter } from './exception.filter.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(EXPRESS_CORE_TYPES.LoggerService) private loggerService: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.loggerService.err(`[${err.context}] Err ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
			return;
		}
		this.loggerService.err(err.message);
		res.status(500).send({ err: err.message });
	}
}
