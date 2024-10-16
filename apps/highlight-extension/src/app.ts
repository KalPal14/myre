import 'reflect-metadata';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';

import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { ILogger, IConfigService, IExceptionFilter, JwtAuthMiddleware } from '~libs/express-core';

import { HIGHLIGHTS_ROUTER_PATH } from '~/highlight-extension/common/constants/routes/highlights';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IWorkspacesController } from '~/highlight-extension/controllers/workspaces-controller/workspaces.controller.interface';
import { IHighlightsController } from '~/highlight-extension/controllers/highlights-controller/highlights.controller.interface';

import { PAGES_ROUTER_PATH } from './common/constants/routes/pages';
import { IPagesController } from './controllers/pages-controller/pages.controller.interface';
import { TPrismaService } from './common/types/prisma-service.interface';
import { WORKSPACES_BASE_ROUTE } from './common/constants/routes/workspaces';

@injectable()
export default class App {
	app: Express;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.WorkspacesController) private usersController: IWorkspacesController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: TPrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.HighlightsController) private highlightsController: IHighlightsController,
		@inject(TYPES.PagesController) private pagesController: IPagesController
	) {
		this.app = express();
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
		this.app.use(WORKSPACES_BASE_ROUTE, this.usersController.router);
		this.app.use(HIGHLIGHTS_ROUTER_PATH, this.highlightsController.router);
		this.app.use(PAGES_ROUTER_PATH, this.pagesController.router);
	}

	useExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(mode: 'test' | 'dev' | 'prod', port?: number): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptions();
		await this.prismaService.connect();

		if (mode == 'test') return;

		this.server = createServer(
			{
				key: readFileSync('host-key.pem'),
				cert: readFileSync('host.pem'),
			},
			this.app
		);
		this.server.listen(port, () => {
			this.logger.log(`The server is running on port ${port}`);
		});
	}
}
