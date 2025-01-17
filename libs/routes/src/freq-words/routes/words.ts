const FREQ_WORDS_URL = process.env.FREQ_WORDS_URL ?? '';

export const WORDS_BASE_ROUTE = `/words`;

export const WORDS_ENDPOINTS = {
	getMark: `/mark/:id`,
	getManyMarks: `/marks`,
	upsertMark: `/upsert-mark`,
};

export const WORDS_URLS = {
	getMark: (id: number): string => `${FREQ_WORDS_URL}${WORDS_BASE_ROUTE}/mark/${id}`,
	getManyMarks: `${FREQ_WORDS_URL}${WORDS_BASE_ROUTE}/marks`,
	upsertMark: `${FREQ_WORDS_URL}${WORDS_BASE_ROUTE}/upsert-mark`,
};
