import 'reflect-metadata';
import { Container } from 'inversify';

import { appBindings } from './utils/bindings/app.bindings';
import { userBindings } from './utils/bindings/user.bindings';

import TYPES from '@/common/constants/types.inversify';
import App from '@/app';

export async function bootstrap(port?: number): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(userBindings);

	const app = container.get<App>(TYPES.App);
	await app.init(port);

	return app;
}

if (!process.env.IS_RUN_E2E) {
	bootstrap();
}
