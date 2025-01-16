import '~libs/express-core/config';

import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import App from '~/highlight-extension/app';
import { TYPES } from '~/highlight-extension/common/constants/types';

import { appBindings } from './utils/bindings/app.bindings';
import { highlightBindings } from './utils/bindings/highlight.bindings';
import { nodesBindings } from './utils/bindings/nodes.bindings';
import { pageBindings } from './utils/bindings/page.bindings';
import { workspaceBindings } from './utils/bindings/workspace.bindings';

export async function bootstrap(): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(workspaceBindings);
	container.load(pageBindings);
	container.load(highlightBindings);
	container.load(nodesBindings);

	const app = container.get<App>(TYPES.App);
	await app.init();

	return app;
}

bootstrap();
