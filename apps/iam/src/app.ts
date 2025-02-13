import 'reflect-metadata';
import { Server, createServer } from 'https';
import { readFileSync } from 'fs';

import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { ILogger, IExceptionFilter, IMiddleware, IConfigService } from '~libs/express-core';
import { OTP_BASE_ROUTE, USERS_BASE_ROUTE } from '~libs/routes/iam';

import { TYPES } from '~/iam/common/constants/types';
import { IUsersController } from '~/iam/controllers/users-controller/users.controller.interface';

import { TPrismaService } from './common/types/prisma-service.interface';
import { IOtpController } from './controllers/otp-controller/otp.controller.interface';

@injectable()
export default class App {
	app: Express;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.UsersController) private usersController: IUsersController,
		@inject(TYPES.OtpController) private otpController: IOtpController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.PrismaService) private prismaService: TPrismaService,
		@inject(TYPES.JwtAuthMiddleware) private jwtAuthMiddleware: IMiddleware,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.app = express();
	}

	useMiddleware(): void {
		const cookieSecret = this.configService.get('COOCKIE_KEY');
		const clientUrl = this.configService.get('H_EXT_FE_URL');

		this.app.use(
			cors({
				origin: clientUrl,
				methods: ['GET', 'PATCH', 'POST', 'DELETE'],
				allowedHeaders: ['Content-Type', 'Authorization'],
			})
		);
		this.app.use(bodyParser.json());
		this.app.use(cookieParser(cookieSecret));

		this.app.use(this.jwtAuthMiddleware.use.bind(this.jwtAuthMiddleware));
	}

	useRoutes(): void {
		this.app.use(OTP_BASE_ROUTE, this.otpController.router);
		this.app.use(USERS_BASE_ROUTE, this.usersController.router);
	}

	useExceptions(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptions();
		await this.prismaService.connect();

		if (process.env.NODE_ENV === 'test') return;

		const port = this.configService.get('IAM_PORT');
		const certKey = this.configService.get('CERT_KEY');
		const cert = this.configService.get('CERT');
		this.server = createServer(
			{
				key: readFileSync(certKey),
				cert: readFileSync(cert),
			},
			this.app
		);
		this.server.listen(port, () => {
			this.logger.log(`The server is running on port ${port}`);
		});
	}
}
