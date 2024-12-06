export const LANGUAGES_BASE_ROUTE = `/languages`;

export const LANGUAGES_ENDPOINTS = {
	get: `/language/:id`,
	getMany: ``,
};

export const LANGUAGES_URLS = {
	get: (id: number): string => `${LANGUAGES_BASE_ROUTE}/language/${id}`,
	getMany: `${LANGUAGES_BASE_ROUTE}`,
};

export const LANGUAGES_FULL_URLS = {
	get: (id: number): string => `${process.env.FREQ_WORDS_URL}${LANGUAGES_URLS.get(id)}`,
	getMany: `${process.env.FREQ_WORDS_URL}${LANGUAGES_URLS}`,
};
