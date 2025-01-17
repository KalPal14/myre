const H_EXT_URL = process.env.H_EXT_URL ?? '';

export const HIGHLIGHTS_BASE_ROUTE = `/highlights`;

export const HIGHLIGHTS_ENDPOINTS = {
	getMany: ``,
	create: `/highlight`,
	update: `/highlight/:id`,
	individualUpdateMany: `/individual-update-many`,
	delete: `/highlight/:id`,
};

export const HIGHLIGHTS_URLS = {
	getMany: `${H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}`,
	create: `${H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight`,
	update: (id: number): string => `${H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
	individualUpdateMany: `${H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/individual-update-many`,
	delete: (id: number): string => `${H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
};
