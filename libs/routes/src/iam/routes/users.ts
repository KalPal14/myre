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
	login: `${USERS_BASE_ROUTE}/login`,
	register: `${USERS_BASE_ROUTE}/register`,
	logout: `${USERS_BASE_ROUTE}/logout`,
	changePassword: `${USERS_BASE_ROUTE}/change-password`,
	changeEmail: `${USERS_BASE_ROUTE}/change-email`,
	changeUsername: `${USERS_BASE_ROUTE}/change-username`,
	getUserInfo: `${USERS_BASE_ROUTE}/get-info`,
};

export const USERS_FULL_URLS = {
	login: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/login`,
	register: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/register`,
	logout: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/logout`,
	changePassword: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/change-password`,
	changeEmail: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/change-email`,
	changeUsername: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/change-username`,
	getUserInfo: `${process.env.IAM_URL}${USERS_BASE_ROUTE}/get-info`,
};
