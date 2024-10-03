import 'reflect-metadata';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';

import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import {
	ILogger,
	IExceptionFilter,
	IConfigService,
	JwtAuthMiddleware,
	IPrismaService,
} from '~libs/express-core';

import { USERS_ROUTER_PATH } from '~/iam/common/constants/routes/users';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersController } from '~/iam/controllers/users-controller/users.controller.interface';

@injectable()
export default class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: IUsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: IPrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		const jwtSecret = this.configService.get('JWT_KEY');
		const cookieSecret = this.configService.get('COOCKIE_KEY');
		const clientUrl = this.configService.get('CLIENT_URL');

		this.app.use(
			cors({
				origin: clientUrl,
				methods: ['GET', 'PATCH', 'POST', 'DELETE'],
				allowedHeaders: ['Content-Type', 'Authorization'],
			})
		);
		this.app.use(bodyParser.json());
		this.app.use(cookieParser(cookieSecret));

		const jwtAuthMiddleware = new JwtAuthMiddleware(jwtSecret);
		this.app.use(jwtAuthMiddleware.execute.bind(jwtAuthMiddleware));
	}

	useRoutes(): void {
		this.app.use(USERS_ROUTER_PATH, this.usersController.router);
	}

	useExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(port?: number): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptions();
		await this.prismaService.connect();
		this.server = createServer(
			{
				key: readFileSync('host-key.pem'),
				cert: readFileSync('host.pem'),
			},
			this.app
		);
		this.server.listen(port || this.port, () => {
			this.logger.log(`The server is running on port ${port || this.port}`);
		});
	}

	close(): void {
		this.server.close();
	}
}
