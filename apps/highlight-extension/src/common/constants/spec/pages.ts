import { PageModel } from '~/highlight-extension/prisma/client';

import { RIGHT_USER, WRONG_USER } from './users';

export const RIGHT_PAGE: PageModel = {
	id: 1,
	userId: RIGHT_USER.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations',
};

export const UPDATED_PAGE: PageModel = {
	id: 1,
	userId: RIGHT_USER.id,
	url: 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-one-relations',
};

export const WRONG_PAGE: Partial<PageModel> = {
	id: 500,
	userId: WRONG_USER.id,
	url: 'https://www.prisma.io/wrong-page',
};

export const INVALID_PAGE: Partial<PageModel> = {
	url: 'https:/www.prisma.io/wrong-page',
};
