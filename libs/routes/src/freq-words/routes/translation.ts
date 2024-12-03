export const TRANSLATION_BASE_ROUTE = `/translation`;

export const TRANSLATION_ENDPOINTS = {
	translate: `/translate`,
};

export const TRANSLATION_URLS = {
	translate: `${TRANSLATION_BASE_ROUTE}/translate`,
};

export const TRANSLATION_FULL_URLS = {
	translate: `${process.env.FREQ_WORDS_URL}${TRANSLATION_BASE_ROUTE}/translate`,
};
