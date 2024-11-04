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

export async function bootstrap(mode: 'test' | 'dev' | 'prod'): Promise<App> {
	const container = new Container();
	container.load(appBindings);
	container.load(expressCoreBindings);
	container.load(workspaceBindings);
	container.load(pageBindings);
	container.load(highlightBindings);
	container.load(nodesBindings);

	const app = container.get<App>(TYPES.App);

	if (mode === 'test') {
		await app.init(mode);
	} else {
		const port = process.env.H_EXT_PORT!;
		await app.init(mode, +port);
	}

	return app;
}

if (!process.env.IS_RUN_E2E) {
	bootstrap('dev');
}
