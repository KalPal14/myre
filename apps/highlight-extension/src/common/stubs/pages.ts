import { CreatePageDto } from '~libs/dto/highlight-extension/pages/create-page.dto';

import { PageModel } from '~/highlight-extension/prisma/client';
import { Page } from '~/highlight-extension/domain/page/page';

import { WORKSPACE_MODEL } from './workspaces';

export const PAGE: Page = {
	workspaceId: WORKSPACE_MODEL.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',
};

export const PAGE_MODEL: PageModel = {
	id: 1,
	...PAGE,
};

export const CREATE_PAGE_DTO: CreatePageDto = {
	workspaceId: WORKSPACE_MODEL.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/new',
};
