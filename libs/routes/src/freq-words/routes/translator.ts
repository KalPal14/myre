const FREQ_WORDS_URL = process.env.FREQ_WORDS_URL ?? '';

export const TRANSLATOR_BASE_ROUTE = `/translation`;

export const TRANSLATOR_ENDPOINTS = {
	translate: `/translate`,
};

export const TRANSLATOR_URLS = {
	translate: `${FREQ_WORDS_URL}${TRANSLATOR_BASE_ROUTE}/translate`,
};
