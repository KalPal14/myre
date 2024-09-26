import 'reflect-metadata';
import { Container } from 'inversify';

import { appBindings } from './utils/bindings/app.bindings';
import { highlightBindings } from './utils/bindings/highlight.bindings';
import { nodesBindings } from './utils/bindings/nodes.bindings';
import { pageBindings } from './utils/bindings/page.bindings';
import { userBindings } from './utils/bindings/user.bindings';

import TYPES from '@/common/constants/types.inversify';
import App from '@/app';

export async function bootstrap(port?: number): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(userBindings);
	container.load(pageBindings);
	container.load(highlightBindings);
	container.load(nodesBindings);

	const app = container.get<App>(TYPES.App);
	await app.init(port);

	return app;
}

if (!process.env.IS_RUN_E2E) {
	bootstrap();
}
