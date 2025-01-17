const FREQ_WORDS_URL = process.env.FREQ_WORDS_URL ?? '';

export const WORKSPACES_BASE_ROUTE = `/workspaces`;

export const WORKSPACES_ENDPOINTS = {
	get: `/workspace/:id`,
	getOwnersWorkspaces: `/users-workspaces`,
	create: `/workspace`,
	update: `/workspace/:id`,
	delete: `/workspace/:id`,
};

export const WORKSPACES_URLS = {
	get: (id: number): string => `${FREQ_WORDS_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	getOwnersWorkspaces: `${FREQ_WORDS_URL}${WORKSPACES_BASE_ROUTE}/users-workspaces`,
	create: `${FREQ_WORDS_URL}${WORKSPACES_BASE_ROUTE}/workspace`,
	update: (id: number): string => `${FREQ_WORDS_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	delete: (id: number): string => `${FREQ_WORDS_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
};
