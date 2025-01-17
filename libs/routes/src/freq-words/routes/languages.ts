const FREQ_WORDS_URL = process.env.FREQ_WORDS_URL ?? '';

export const LANGUAGES_BASE_ROUTE = `/languages`;

export const LANGUAGES_ENDPOINTS = {
	get: `/language/:id`,
	getMany: ``,
};

export const LANGUAGES_URLS = {
	get: (id: number): string => `${FREQ_WORDS_URL}${LANGUAGES_BASE_ROUTE}/language/${id}`,
	getMany: `${FREQ_WORDS_URL}${LANGUAGES_BASE_ROUTE}`,
};
