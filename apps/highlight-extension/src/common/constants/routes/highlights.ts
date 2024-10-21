export const HIGHLIGHTS_BASE_ROUTE = `/highlights`;

export const HIGHLIGHTS_ENDPOINTS = {
	getMany: ``,
	create: `/highlight`,
	update: `/highlight/:id`,
	individualUpdateMany: `/individual-update-many`,
	delete: `/highlight/:id`,
};

export const HIGHLIGHTS_URLS: Record<keyof typeof HIGHLIGHTS_ENDPOINTS, any> = {
	getMany: `${HIGHLIGHTS_BASE_ROUTE}`,
	create: `${HIGHLIGHTS_BASE_ROUTE}/highlight`,
	update: (id: number): string => `${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
	individualUpdateMany: `${HIGHLIGHTS_BASE_ROUTE}/individual-update-many`,
	delete: (id: number): string => `${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
};
