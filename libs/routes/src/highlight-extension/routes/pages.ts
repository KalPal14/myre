const H_EXT_URL = process.env.H_EXT_URL ?? '';

export const PAGES_BASE_ROUTE = `/pages`;

export const PAGES_ENDPOINTS = {
	get: `/page`,
	getPagesShortInfo: `/get-all`,
	update: `/page/:id`,
};

export const PAGES_URLS = {
	get: `${H_EXT_URL}${PAGES_BASE_ROUTE}/page`,
	getPagesShortInfo: `${H_EXT_URL}${PAGES_BASE_ROUTE}/get-all`,
	update: (id: number): string => `${H_EXT_URL}${PAGES_BASE_ROUTE}/page/${id}`,
};
