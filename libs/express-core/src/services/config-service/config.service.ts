import path from 'path';
import { readFileSync } from 'fs';

import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { parse, DotenvParseOutput } from 'dotenv';

import { EXPRESS_CORE_TYPES } from '~libs/express-core';

import { ILogger } from '../logger-service/logger.service.interface';

import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private envName: string;
	env: DotenvParseOutput;

	constructor(@inject(EXPRESS_CORE_TYPES.LoggerService) private loggerService: ILogger) {
		const envName = process.env.NODE_ENV || 'dev';
		const envFilePath = path.resolve(__dirname, `../../../../../.env.${envName}`);

		const env: DotenvParseOutput = parse(readFileSync(envFilePath));
		if (!Object.keys(env).length) {
			this.loggerService.err(
				`[ConfigService] Failed to parse .env.${envName} file. It may be missing or empty.`
			);
			return;
		}

		this.loggerService.log(`[ConfigService] .env.${envName} file parsed successfully`);
		this.envName = envName;
		this.env = env;
	}

	get(key: string): string {
		if (this.env[key]) {
			return this.env[key];
		}
		const errMsg = `[ConfigService] There is no variable with the key ${key} in .env.${this.envName}`;
		this.loggerService.err(errMsg);
		throw new Error(errMsg);
	}
}
