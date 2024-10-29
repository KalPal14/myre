export const WORKSPACES_BASE_ROUTE = `/workspaces`;

export const WORKSPACES_ENDPOINTS = {
	get: `/workspace/:id`,
	getAllOwners: `/all-user`,
	create: `/workspace`,
	update: `/workspace/:id`,
	delete: `/workspace/:id`,
};

export const WORKSPACES_URLS = {
	get: (id: number): string => `${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	getAllOwners: `${WORKSPACES_BASE_ROUTE}/all-user`,
	create: `${WORKSPACES_BASE_ROUTE}/workspace`,
	update: (id: number): string => `${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	delete: (id: number): string => `${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
};

export const WORKSPACES_FULL_URLS = {
	get: (id: number): string => `${process.env.H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	getAllOwners: `${process.env.H_EXT_URL}${WORKSPACES_BASE_ROUTE}/all-user`,
	create: `${process.env.H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace`,
	update: (id: number): string =>
		`${process.env.H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	delete: (id: number): string =>
		`${process.env.H_EXT_URL}${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
};
