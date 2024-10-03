import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

import { EXPRESS_CORE_TYPES } from '~libs/express-core';

import { ILogger } from '../logger-service/logger.service.interface';

import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	protected envFile: string;
	env: DotenvParseOutput;

	constructor(@inject(EXPRESS_CORE_TYPES.LoggerService) private loggerService: ILogger) {
		this.envFile = process.env.NODE_ENV || '.env.dev';

		const result: DotenvConfigOutput = config({ path: this.envFile });

		if (result.error || !result.parsed) {
			this.loggerService.err(
				`[ConfigService] Failed to parse ${this.envFile} file. It may be missing.`
			);
		} else {
			this.loggerService.log(`[ConfigService] ${this.envFile} file parsed successfully`);
			this.env = result.parsed;
		}
	}

	get(key: string): string {
		if (this.env[key]) {
			return this.env[key];
		}
		this.loggerService.err(
			`[ConfigService] There is no variable with the key ${key} in ${this.envFile}`
		);
		throw new Error(`${this.envFile} does not have the value you are trying to get`);
	}
}
