import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';

import { ILogger, EXPRESS_CORE_TYPES } from '~libs/express-core';

import { IBasePrismaService } from './base-prisma.service.interface';

@injectable()
export class PrismaService<GeneratedPrismaClient = PrismaClient>
	implements IBasePrismaService<GeneratedPrismaClient>
{
	constructor(
		@inject(EXPRESS_CORE_TYPES.PrismaClient) private _client: PrismaClient,
		@inject(EXPRESS_CORE_TYPES.LoggerService) private loggerService: ILogger
	) {}

	get client(): GeneratedPrismaClient {
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
