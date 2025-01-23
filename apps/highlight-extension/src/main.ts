import '~libs/express-core/config';

import 'reflect-metadata';
import { Container } from 'inversify';

import { expressCoreBindings } from '~libs/express-core';

import App from '~/highlight-extension/app';
import { TYPES } from '~/highlight-extension/common/constants/types';

import { appBindings } from './common/bindings/app.bindings';
import { highlightBindings } from './common/bindings/highlight.bindings';
import { nodesBindings } from './common/bindings/nodes.bindings';
import { pageBindings } from './common/bindings/page.bindings';
import { workspaceBindings } from './common/bindings/workspace.bindings';

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
