import { PageModel } from '@prisma/client';

import { TPageShortInfo } from './types/page-short-info.type';
import { TPageAllInfo } from './types/page-all-info.type';

import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { UpdatePageDto } from '@/dto/pages/update-page.dto';

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
