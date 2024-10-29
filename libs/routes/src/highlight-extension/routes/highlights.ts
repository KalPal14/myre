export const HIGHLIGHTS_BASE_ROUTE = `/highlights`;

export const HIGHLIGHTS_ENDPOINTS = {
	getMany: ``,
	create: `/highlight`,
	update: `/highlight/:id`,
	individualUpdateMany: `/individual-update-many`,
	delete: `/highlight/:id`,
};

export const HIGHLIGHTS_URLS = {
	getMany: `${HIGHLIGHTS_BASE_ROUTE}`,
	create: `${HIGHLIGHTS_BASE_ROUTE}/highlight`,
	update: (id: number): string => `${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
	individualUpdateMany: `${HIGHLIGHTS_BASE_ROUTE}/individual-update-many`,
	delete: (id: number): string => `${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
};

export const HIGHLIGHTS_FULL_URLS = {
	getMany: `${process.env.H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}`,
	create: `${process.env.H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight`,
	update: (id: number): string =>
		`${process.env.H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
	individualUpdateMany: `${process.env.H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/individual-update-many`,
	delete: (id: number): string =>
		`${process.env.H_EXT_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
};
