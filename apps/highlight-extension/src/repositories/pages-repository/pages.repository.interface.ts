import { PageModel } from '~/highlight-extension/prisma/client';
import { Page } from '~/highlight-extension/domain/page/page';

import { IPageDeepModel } from './types/page-deep-model.interface';

export interface IPagesRepository {
	findBy: (findData: Partial<PageModel>) => Promise<PageModel | null>;
	deepFindBy: (findData: Partial<PageModel>) => Promise<IPageDeepModel | null>;
	findManyBy: (findData: Partial<PageModel>) => Promise<PageModel[]>;
	deepFindManyBy: (findData: Partial<PageModel>) => Promise<IPageDeepModel[]>;

	create: (page: Page) => Promise<PageModel>;
	delete: (id: number) => Promise<PageModel>;
	update: (id: number, payload: Partial<Page>) => Promise<PageModel>;
}
