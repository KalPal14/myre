import { createRoutesFullPath } from '~libs/common';

export const PAGES_ROUTER_PATH = '/pages';

export const PAGES_PATH = {
	getPage: '/page',
	getPages: '/get-all',
	updatePage: '/page/:id',
};

export const PAGES_FULL_PATH = createRoutesFullPath(PAGES_ROUTER_PATH, PAGES_PATH);
