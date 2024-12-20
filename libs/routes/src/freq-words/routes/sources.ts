export const SOURCES_BASE_ROUTE = `/sources`;

export const SOURCES_ENDPOINTS = {
	get: `/source/:id`,
	getMany: `/`,
	getOrCreate: `/source/get-or-create`,
	update: `/source/:id`,
	delete: `/source/:id`,
};

export const SOURCES_URLS = {
	get: (id: number): string => `${SOURCES_BASE_ROUTE}/source/${id}`,
	getMany: `${SOURCES_BASE_ROUTE}/`,
	getOrCreate: `${SOURCES_BASE_ROUTE}/source/get-or-create`,
	update: (id: number): string => `${SOURCES_BASE_ROUTE}/source/${id}`,
	delete: (id: number): string => `${SOURCES_BASE_ROUTE}/source/${id}`,
};

export const SOURCES_FULL_URLS = {
	get: (id: number): string => `${process.env.H_EXT_URL}${SOURCES_URLS.get(id)}`,
	getMany: `${process.env.H_EXT_URL}${SOURCES_BASE_ROUTE}${SOURCES_URLS.getMany}`,
	getOrCreate: `${process.env.H_EXT_URL}${SOURCES_URLS.getOrCreate}`,
	update: (id: number): string => `${process.env.H_EXT_URL}${SOURCES_URLS.update(id)}`,
	delete: (id: number): string => `${process.env.H_EXT_URL}${SOURCES_URLS.delete(id)}`,
};
