const IAM_URL = process.env.IAM_URL ?? '';

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

export const USERS_URLS = {
	login: `${IAM_URL}${USERS_BASE_ROUTE}/login`,
	register: `${IAM_URL}${USERS_BASE_ROUTE}/register`,
	logout: `${IAM_URL}${USERS_BASE_ROUTE}/logout`,
	changePassword: `${IAM_URL}${USERS_BASE_ROUTE}/change-password`,
	changeEmail: `${IAM_URL}${USERS_BASE_ROUTE}/change-email`,
	changeUsername: `${IAM_URL}${USERS_BASE_ROUTE}/change-username`,
	getUserInfo: `${IAM_URL}${USERS_BASE_ROUTE}/get-info`,
};
