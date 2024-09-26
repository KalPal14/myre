import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { HTTPError } from '../http-error.class';

import { IExceptionFilter } from './exception.filter.interface';

import { ILogger } from '@/utils/services/logger-service/logger.service.interface';
import TYPES from '@/common/constants/types.inversify';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {}

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
