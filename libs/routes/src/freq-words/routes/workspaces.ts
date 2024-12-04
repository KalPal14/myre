export const WORKSPACES_BASE_ROUTE = `/workspaces`;

export const WORKSPACES_ENDPOINTS = {
	get: `/workspace/:id`,
	getManyOwners: `/users-workspaces`,
	create: `/workspace`,
	update: `/workspace/:id`,
	delete: `/workspace/:id`,
};

export const WORKSPACES_URLS = {
	get: (id: number): string => `${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	getManyOwners: `${WORKSPACES_BASE_ROUTE}/users-workspaces`,
	create: `${WORKSPACES_BASE_ROUTE}/workspace`,
	update: (id: number): string => `${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
	delete: (id: number): string => `${WORKSPACES_BASE_ROUTE}/workspace/${id}`,
};

export const WORKSPACES_FULL_URLS = {
	get: (id: number): string => `${process.env.H_EXT_URL}${WORKSPACES_URLS.get(id)}`,
	getAllOwners: `${process.env.H_EXT_URL}${WORKSPACES_BASE_ROUTE}${WORKSPACES_URLS.getManyOwners}`,
	create: `${process.env.H_EXT_URL}${WORKSPACES_URLS.create}`,
	update: (id: number): string => `${process.env.H_EXT_URL}${WORKSPACES_URLS.update(id)}`,
	delete: (id: number): string => `${process.env.H_EXT_URL}${WORKSPACES_URLS.delete(id)}`,
};
