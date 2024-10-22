import { DOMAIN_URL } from './app';

export const PAGES_BASE_ROUTE = `/pages`;

export const PAGES_ENDPOINTS = {
	get: `/page`,
	getPagesShortInfo: `/get-all`,
	update: `/page/:id`,
};

export const PAGES_URLS: Record<keyof typeof PAGES_ENDPOINTS, any> = {
	get: `${PAGES_BASE_ROUTE}/page`,
	getPagesShortInfo: `${PAGES_BASE_ROUTE}/get-all`,
	update: (id: number): string => `${PAGES_BASE_ROUTE}/page/${id}`,
};

export const PAGES_FULL_URLS: Record<keyof typeof PAGES_ENDPOINTS, any> = {
	get: `${DOMAIN_URL}${PAGES_BASE_ROUTE}/page`,
	getPagesShortInfo: `${DOMAIN_URL}${PAGES_BASE_ROUTE}/get-all`,
	update: (id: number): string => `${DOMAIN_URL}${PAGES_BASE_ROUTE}/page/${id}`,
};
