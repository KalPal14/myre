import '~libs/express-core/config';

import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import { TYPES } from '~/iam/common/constants/types';
import App from '~/iam/app';

import { appBindings } from './utils/bindings/app.bindings';
import { userBindings } from './utils/bindings/user.bindings';

export async function bootstrap(mode: 'test' | 'dev' | 'prod'): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(userBindings);

	const app = container.get<App>(TYPES.App);

	if (mode === 'test') {
		await app.init(mode);
	} else {
		const port = process.env.IAM_PORT!;
		await app.init(mode, +port);
	}

	return app;
}

if (!process.env.IS_RUN_E2E) {
	bootstrap('dev');
}
