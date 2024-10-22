import { DOMAIN_URL } from './app';

export const USERS_BASE_ROUTE = `/users`;

export const USERS_ENDPOINTS = {
	login: `/login`,
	register: `/register`,
	logout: `/logout`,
	changePassword: `/change-password`,
	changeEmail: `/change-email`,
	changeUsername: `/change-username`,
	getUserInfo: `/get-info`,
};

export const USERS_URLS: Record<keyof typeof USERS_ENDPOINTS, any> = {
	login: `${USERS_BASE_ROUTE}/login`,
	register: `${USERS_BASE_ROUTE}/register`,
	logout: `${USERS_BASE_ROUTE}/logout`,
	changePassword: `${USERS_BASE_ROUTE}/change-password`,
	changeEmail: `${USERS_BASE_ROUTE}/change-email`,
	changeUsername: `${USERS_BASE_ROUTE}/change-username`,
	getUserInfo: `${USERS_BASE_ROUTE}/get-info`,
};

export const USERS_FULL_URLS: Record<keyof typeof USERS_ENDPOINTS, any> = {
	login: `${DOMAIN_URL}${USERS_BASE_ROUTE}/login`,
	register: `${DOMAIN_URL}${USERS_BASE_ROUTE}/register`,
	logout: `${DOMAIN_URL}${USERS_BASE_ROUTE}/logout`,
	changePassword: `${DOMAIN_URL}${USERS_BASE_ROUTE}/change-password`,
	changeEmail: `${DOMAIN_URL}${USERS_BASE_ROUTE}/change-email`,
	changeUsername: `${DOMAIN_URL}${USERS_BASE_ROUTE}/change-username`,
	getUserInfo: `${DOMAIN_URL}${USERS_BASE_ROUTE}/get-info`,
};
