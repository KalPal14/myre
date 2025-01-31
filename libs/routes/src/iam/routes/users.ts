const IAM_URL = process.env.IAM_URL ?? '';

export const USERS_BASE_ROUTE = `/users`;

export const USERS_ENDPOINTS = {
	login: `/login`,
	register: `/register`,
	logout: `/logout`,
	update: '/update',
	getUserInfo: `/get-info`,
};

export const USERS_URLS = {
	login: `${IAM_URL}${USERS_BASE_ROUTE}/login`,
	register: `${IAM_URL}${USERS_BASE_ROUTE}/register`,
	logout: `${IAM_URL}${USERS_BASE_ROUTE}/logout`,
	update: `${IAM_URL}${USERS_BASE_ROUTE}/update`,
	getUserInfo: `${IAM_URL}${USERS_BASE_ROUTE}/get-info`,
};
