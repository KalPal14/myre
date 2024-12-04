export const MARKED_WORDS_BASE_ROUTE = `/marked_words`;

export const MARKED_WORDS_ENDPOINTS = {
	get: `/marked-word/:id`,
	getMany: ``,
	mark: `/mark`,
};

export const MARKED_WORDS_URLS = {
	get: (id: number): string => `${MARKED_WORDS_BASE_ROUTE}/marked-word/${id}`,
	getMany: `${MARKED_WORDS_BASE_ROUTE}`,
	mark: `${MARKED_WORDS_BASE_ROUTE}/mark`,
};

export const MARKED_WORDS_FULL_URLS = {
	get: (id: number): string => `${process.env.FREQ_WORDS_URL}${MARKED_WORDS_URLS.get(id)}`,
	getMany: `${process.env.FREQ_WORDS_URL}${MARKED_WORDS_URLS.getMany}`,
	mark: `${process.env.FREQ_WORDS_URL}${MARKED_WORDS_URLS.mark}`,
};
