export const WORDS_BASE_ROUTE = `/words`;

export const WORDS_ENDPOINTS = {
	getMark: `/mark/:id`,
	getManyMarks: `/marks`,
	createMark: `/mark`,
};

export const WORDS_URLS = {
	getMark: (id: number): string => `${WORDS_BASE_ROUTE}/mark/${id}`,
	getManyMarks: `${WORDS_BASE_ROUTE}/marks`,
	createMark: `${WORDS_BASE_ROUTE}/mark`,
};

export const WORDS_FULL_URLS = {
	getMark: (id: number): string => `${process.env.FREQ_WORDS_URL}${WORDS_URLS.getMark(id)}`,
	getManyMarks: `${process.env.FREQ_WORDS_URL}${WORDS_URLS.getManyMarks}`,
	createMark: `${process.env.FREQ_WORDS_URL}${WORDS_URLS.createMark}`,
};
