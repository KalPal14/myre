import { DOMAIN_URL } from './app';

export const HIGHLIGHTS_BASE_ROUTE = `/highlights`;

export const HIGHLIGHTS_ENDPOINTS = {
	getMany: ``,
	create: `/highlight`,
	update: `/highlight/:id`,
	individualUpdateMany: `/individual-update-many`,
	delete: `/highlight/:id`,
};

export const HIGHLIGHTS_URLS: Record<keyof typeof HIGHLIGHTS_ENDPOINTS, any> = {
	getMany: `${HIGHLIGHTS_BASE_ROUTE}`,
	create: `${HIGHLIGHTS_BASE_ROUTE}/highlight`,
	update: (id: number): string => `${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
	individualUpdateMany: `${HIGHLIGHTS_BASE_ROUTE}/individual-update-many`,
	delete: (id: number): string => `${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
};

export const HIGHLIGHTS_FULL_URLS: Record<keyof typeof HIGHLIGHTS_ENDPOINTS, any> = {
	getMany: `${DOMAIN_URL}${HIGHLIGHTS_BASE_ROUTE}`,
	create: `${DOMAIN_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight`,
	update: (id: number): string => `${DOMAIN_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
	individualUpdateMany: `${DOMAIN_URL}${HIGHLIGHTS_BASE_ROUTE}/individual-update-many`,
	delete: (id: number): string => `${DOMAIN_URL}${HIGHLIGHTS_BASE_ROUTE}/highlight/${id}`,
};
