import { PageModel } from '~/highlight-extension/prisma/client';

import { WORKSPACE_MODEL } from './workspaces';

export const RIGHT_PAGE: PageModel = {
	id: 1,
	workspaceId: WORKSPACE_MODEL.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',
};

export const UPDATED_PAGE: PageModel = {
	id: 1,
	workspaceId: WORKSPACE_MODEL.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-one-relations',
};

export const WRONG_PAGE: Partial<PageModel> = {
	id: 500,
	workspaceId: WORKSPACE_MODEL.id,
	url: 'https://www.prisma.io/wrong-page',
};

export const INVALID_PAGE: Partial<PageModel> = {
	url: 'https:/www.prisma.io/wrong-page',
};
