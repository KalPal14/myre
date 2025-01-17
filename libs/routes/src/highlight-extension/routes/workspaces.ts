const H_EXT_URL = process.env.H_EXT_URL ?? '';

export const WORKSPACES_BASE_ROUTE = `/workspaces`;

export const WORKSPACES_ENDPOINTS = {
	get: `/workspace/:id`,
	getAllOwners: `/all-user`,
	create: `/workspace`,
	update: `/workspace/:id`,
	delete: `/workspace/:id`,
};

export const WORKSPACES_URLS = {
	get: (id: number): string => `${H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	getAllOwners: `${H_EXT_URL}${WORKSPACES_BASE_ROUTE}/all-user`,
	create: `${H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace`,
	update: (id: number): string => `${H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	delete: (id: number): string => `${H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
};
