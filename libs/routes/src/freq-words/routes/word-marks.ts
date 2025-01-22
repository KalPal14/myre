const FREQ_WORDS_URL = process.env.FREQ_WORDS_URL ?? '';

export const WORD_MARKS_BASE_ROUTE = `/words`;

export const WORD_MARKS_ENDPOINTS = {
	get: `/mark/:id`,
	getMany: `/marks`,
	upsert: `/upsert-mark`,
};

export const WORD_MARKS_URLS = {
	get: (id: number): string => `${FREQ_WORDS_URL}${WORD_MARKS_BASE_ROUTE}/mark/${id}`,
	getMany: `${FREQ_WORDS_URL}${WORD_MARKS_BASE_ROUTE}/marks`,
	upsert: `${FREQ_WORDS_URL}${WORD_MARKS_BASE_ROUTE}/upsert-mark`,
};
