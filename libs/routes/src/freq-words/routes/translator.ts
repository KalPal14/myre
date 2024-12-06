export const TRANSLATOR_BASE_ROUTE = `/translation`;

export const TRANSLATOR_ENDPOINTS = {
	translate: `/translate`,
};

export const TRANSLATOR_URLS = {
	translate: `${TRANSLATOR_BASE_ROUTE}/translate`,
};

export const TRANSLATOR_FULL_URLS = {
	translate: `${process.env.FREQ_WORDS_URL}${TRANSLATOR_URLS.translate}`,
};
