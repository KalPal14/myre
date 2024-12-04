export const WORD_SETS_BASE_ROUTE = `/word-sets`;

export const WORD_SETS_ENDPOINTS = {
	get: `/word-set/:id`,
	getMany: ``,
	create: `/word-set`,
	update: `/word-set/:id`,
	delete: `/word-set/:id`,
};

export const WORD_SETS_URLS = {
	get: (id: number): string => `${WORD_SETS_BASE_ROUTE}/word-set/${id}`,
	getMany: `${WORD_SETS_BASE_ROUTE}`,
	create: `${WORD_SETS_BASE_ROUTE}/word-set`,
	update: (id: number): string => `${WORD_SETS_BASE_ROUTE}/word-set/${id}`,
	delete: (id: number): string => `${WORD_SETS_BASE_ROUTE}/word-set/${id}`,
};

export const WORD_SETS_FULL_URLS = {
	get: (id: number): string => `${process.env.FREQ_WORDS_URL}${WORD_SETS_URLS.get(id)}`,
	getMany: `${process.env.FREQ_WORDS_URL}${WORD_SETS_URLS}`,
	create: `${process.env.FREQ_WORDS_URL}${WORD_SETS_URLS.create}`,
	update: (id: number): string => `${process.env.FREQ_WORDS_URL}${WORD_SETS_URLS.update(id)}`,
	delete: (id: number): string => `${process.env.FREQ_WORDS_URL}${WORD_SETS_URLS.delete(id)}`,
};
