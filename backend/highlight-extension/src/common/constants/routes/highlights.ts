import { createRoutesFullPath } from '@/utils/helper-functions/create-routes-full-path/create-routes-full-path.helper';

export const HIGHLIGHTS_ROUTER_PATH = '/highlights';

export const HIGHLIGHTS_PATH = {
	get: '',
	create: '/highlight',
	update: '/highlight/:id',
	individualUpdateMany: '/individual-update-many',
	delete: '/highlight/:id',
};

export const HIGHLIGHTS_FULL_PATH = createRoutesFullPath(HIGHLIGHTS_ROUTER_PATH, HIGHLIGHTS_PATH);
