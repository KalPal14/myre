import 'reflect-metadata';
import { injectable } from 'inversify';
import { Logger } from 'tslog';

import { ILogger } from './logger.service.interface';

@injectable()
export class LoggerService implements ILogger {
	private logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	err(...args: unknown[]): void {
		this.logger.error(...args);
	}
}
