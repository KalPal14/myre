import { PageModel } from '~/highlight-extension/prisma/client';
import { IPage } from '~/highlight-extension/entities/page-entity/page.entity.interface';

import { TPageDeepModel } from './types/page-deep-model.type';

export interface IPagesRepository {
	create: (page: IPage) => Promise<PageModel>;
	update: (id: number, payload: Pick<IPage, 'url'>) => Promise<PageModel>;
	findByUrl: (
		url: string,
		userId: number,
		includeHighlights?: boolean
	) => Promise<TPageDeepModel | null>;
	findById: (id: number) => Promise<PageModel | null>;
	findAll: (userId: number, includeHighlights?: boolean) => Promise<TPageDeepModel[]>;
	delete: (id: number) => Promise<PageModel>;
}
