import { PageModel } from '~/highlight-extension/prisma/client';
import { Page } from '~/highlight-extension/domain/page/page';

import { TPageDeepModel } from './types/page-deep-model.type';

export interface IPagesRepository {
	create: (page: Page) => Promise<PageModel>;
	update: (id: number, payload: Pick<Page, 'url'>) => Promise<PageModel>;
	findByUrl: (
		url: string,
		workspaceId: number,
		includeHighlights?: boolean
	) => Promise<TPageDeepModel | null>;
	findById: (id: number) => Promise<PageModel | null>;
	findAll: (workspaceId: number, includeHighlights?: boolean) => Promise<TPageDeepModel[]>;
	delete: (id: number) => Promise<PageModel>;
}
