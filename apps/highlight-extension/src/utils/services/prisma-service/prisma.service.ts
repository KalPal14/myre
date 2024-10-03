import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { ILogger } from '~libs/express-core';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { PrismaClient } from '~/highlight-extension/prisma/client';

import { IPrismaService } from './prisma.service.interface';

@injectable()
export class PrismaService implements IPrismaService {
	_client: PrismaClient;

	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {
		this._client = new PrismaClient();
	}

	get client(): PrismaClient {
		return this._client;
	}

	async connect(): Promise<void> {
		try {
			await this._client.$connect();
			this.loggerService.log('[PrismaService] Successfully connected to the database');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.log('[PrismaService] Failed to connect to the database.', e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this._client.$disconnect();
			this.loggerService.log('[PrismaService] Successfully disconnected from the database');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.log(
					'[PrismaService] Failed to disconnect from the database.',
					e.message
				);
			}
		}
	}
}
