import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import { TYPES } from '~/iam/common/constants/types';
import App from '~/iam/app';

import { appBindings } from './utils/bindings/app.bindings';
import { userBindings } from './utils/bindings/user.bindings';

export async function bootstrap(mode: 'test'): Promise<App>;
export async function bootstrap(mode: 'dev' | 'prod', port: number): Promise<App>;
export async function bootstrap(mode: 'test' | 'dev' | 'prod', port?: number): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(userBindings);

	const app = container.get<App>(TYPES.App);
	await app.init(mode, port);

	return app;
}

if (!process.env.IS_RUN_E2E) {
	bootstrap('dev', 8000);
}
