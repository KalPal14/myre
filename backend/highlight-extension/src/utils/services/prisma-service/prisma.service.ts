import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';

import { ILogger } from '../logger-service/logger.service.interface';

import { IPrismaService } from './prisma.service.interface';

import TYPES from '@/common/constants/types.inversify';

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
