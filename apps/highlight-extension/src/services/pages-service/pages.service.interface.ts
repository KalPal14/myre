import { UpdatePageDto } from '~libs/dto/highlight-extension';

import { PageModel } from '~/highlight-extension/prisma/client';

import { TPageShortInfo } from './types/page-short-info.type';
import { TPageAllInfo } from './types/page-all-info.type';

export interface IPagesServise {
	createPage: (pageUrl: string, workspaceId: number) => Promise<PageModel | Error>;
	updatePage: (
		userId: number,
		pageId: number,
		payload: UpdatePageDto
	) => Promise<PageModel | Error>;
	getPageInfo: (url: string, userId: number) => Promise<TPageAllInfo | null>;
	getPagesInfo: (userId: number) => Promise<TPageShortInfo[]>;
}
