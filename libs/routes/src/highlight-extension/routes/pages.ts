export const PAGES_BASE_ROUTE = `/pages`;

export const PAGES_ENDPOINTS = {
	get: `/page`,
	getPagesShortInfo: `/get-all`,
	update: `/page/:id`,
};

export const PAGES_URLS = {
	get: `${PAGES_BASE_ROUTE}/page`,
	getPagesShortInfo: `${PAGES_BASE_ROUTE}/get-all`,
	update: (id: number): string => `${PAGES_BASE_ROUTE}/page/${id}`,
};

export const PAGES_FULL_URLS = {
	get: `${process.env.H_EXT_URL}${PAGES_BASE_ROUTE}/page`,
	getPagesShortInfo: `${process.env.H_EXT_URL}${PAGES_BASE_ROUTE}/get-all`,
	update: (id: number): string => `${process.env.H_EXT_URL}${PAGES_BASE_ROUTE}/page/${id}`,
};
