import { IJwtPayload } from '~libs/express-core';

import { PageModel } from '~/highlight-extension/prisma/client';
import { UpdatePageDto } from '~/highlight-extension/dto/pages/update-page.dto';

import { TPageShortInfo } from './types/page-short-info.type';
import { TPageAllInfo } from './types/page-all-info.type';

export interface IPagesServise {
	createPage: (pageUrl: string, userData: IJwtPayload) => Promise<PageModel | Error>;
	updatePage: (
		userId: number,
		pageId: number,
		payload: UpdatePageDto
	) => Promise<PageModel | Error>;
	getPageInfo: (url: string, userId: number) => Promise<TPageAllInfo | null>;
	getPagesInfo: (userId: number) => Promise<TPageShortInfo[]>;
}
