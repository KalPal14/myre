import '~libs/express-core/config';

import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import { appBindings } from './common/bindings/app.bindings';
import { userBindings } from './common/bindings/user.bindings';
import { TYPES } from './common/constants/types';
import App from './app';

export async function bootstrap(): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(userBindings);

	const app = container.get<App>(TYPES.App);
	await app.init();

	return app;
}

bootstrap();
