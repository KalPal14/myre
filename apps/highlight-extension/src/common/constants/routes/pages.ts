export const PAGES_BASE_ROUTE = `/pages`;

export const PAGES_ENDPOINTS = {
	get: `/page`,
	getPagesShortInfo: `/get-all`,
	update: `/page/:id`,
};

export const PAGES_URLS: Record<keyof typeof PAGES_ENDPOINTS, any> = {
	get: `${PAGES_BASE_ROUTE}/page`,
	getPagesShortInfo: `${PAGES_BASE_ROUTE}/get-all`,
	update: (id: number): string => `${PAGES_BASE_ROUTE}/page/${id}`,
};
