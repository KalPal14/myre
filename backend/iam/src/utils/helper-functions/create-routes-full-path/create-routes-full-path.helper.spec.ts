import { createRoutesFullPath } from './create-routes-full-path.helper';

const ROOT = '/root';
const ROUTES = {
	create: '/create',
	update: '/update',
	delete: '/delete',
};
const FULL_PATH_ROUTES = {
	create: ROOT + ROUTES.create,
	update: ROOT + ROUTES.update,
	delete: ROOT + ROUTES.delete,
};

describe('createRoutesFullPath Helper', () => {
	it('success', async () => {
		const result = createRoutesFullPath(ROOT, ROUTES);

		expect(result).toEqual(FULL_PATH_ROUTES);
	});
	it('success: empty routes', async () => {
		const result = createRoutesFullPath(ROOT, {});

		expect(result).toEqual({});
	});
});
