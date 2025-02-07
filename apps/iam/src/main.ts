import '~libs/express-core/config';

import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import { appBindings } from './common/bindings/app.bindings';
import { userBindings } from './common/bindings/user.bindings';
import { TYPES } from './common/constants/types';
import App from './app';
import { otpBindings } from './common/bindings/otp.bindings';
import { IOtpService } from './services/otp-service/otp.service.interface';

export async function bootstrap(): Promise<{ app: App; otpService: IOtpService }> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(otpBindings);
	container.load(userBindings);

	const app = container.get<App>(TYPES.App);
	await app.init();

	return { app: app, otpService: container.get<IOtpService>(TYPES.OtpService) };
}

bootstrap();
