const FREQ_WORDS_URL = process.env.FREQ_WORDS_URL ?? '';

export const SOURCES_BASE_ROUTE = `/sources`;

export const SOURCES_ENDPOINTS = {
	get: `/source/:id`,
	getMany: `/`,
	getOrCreate: `/source/get-or-create`,
	update: `/source/:id`,
	delete: `/source/:id`,
};

export const SOURCES_URLS = {
	get: (id: number): string => `${FREQ_WORDS_URL}${SOURCES_BASE_ROUTE}/source/${id}`,
	getMany: `${FREQ_WORDS_URL}${SOURCES_BASE_ROUTE}/`,
	getOrCreate: `${FREQ_WORDS_URL}${SOURCES_BASE_ROUTE}/source/get-or-create`,
	update: (id: number): string => `${FREQ_WORDS_URL}${SOURCES_BASE_ROUTE}/source/${id}`,
	delete: (id: number): string => `${FREQ_WORDS_URL}${SOURCES_BASE_ROUTE}/source/${id}`,
};
