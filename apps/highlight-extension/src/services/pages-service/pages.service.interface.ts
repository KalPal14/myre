import { UpdatePageDto } from '~libs/dto/highlight-extension';
import { CreatePageDto } from '~libs/dto/highlight-extension/pages/create-page.dto';

import { PageModel } from '~/highlight-extension/prisma/client';

import { IPageShortInfo } from './types/page-short-info.interface';
import { IPageFullInfo } from './types/page-full-info.interface';

export interface IPagesServise {
	getFullInfo: (url: string, workspaceId: number) => Promise<IPageFullInfo | null>;
	getPagesShortInfo: (workspaceId: number) => Promise<IPageShortInfo[]>;

	create: (page: CreatePageDto) => Promise<PageModel>;
	update: (pageId: number, payload: UpdatePageDto) => Promise<PageModel>;
}
