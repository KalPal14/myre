import { createRoutesFullPath } from '~libs/common';

export const USERS_ROUTER_PATH = '/users';

export const USERS_PATH = {
	login: '/login',
	register: '/register',
	logout: '/logout',
	updateUser: '/update-user',
	changePassword: '/change-password',
	changeEmail: '/change-email',
	changeUsername: '/change-username',
	getUserInfo: '/get-info',
};

export const USERS_FULL_PATH = createRoutesFullPath(USERS_ROUTER_PATH, USERS_PATH);
