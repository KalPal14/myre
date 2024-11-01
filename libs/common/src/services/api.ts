import { HTTPError } from '~libs/common/errors/http-error/http-error';

export function get<DTO, RO>(url: string, data?: DTO, init?: RequestInit): Promise<RO | HTTPError> {
	return fetchLayout('GET', url, undefined, data, init);
}

export function post<DTO, RO>(
	url: string,
	data?: DTO,
	init?: RequestInit
): Promise<RO | HTTPError> {
	return fetchLayout('POST', url, data, undefined, init);
}

export function patch<DTO, RO>(
	url: string,
	data?: DTO,
	init?: RequestInit
): Promise<RO | HTTPError> {
	return fetchLayout('PATCH', url, data, undefined, init);
}

export function apiDelete<DTO, RO>(
	url: string,
	data?: DTO,
	init?: RequestInit
): Promise<RO | HTTPError> {
	return fetchLayout('DELETE', url, data, undefined, init);
}

async function fetchLayout<DTO, RO>(
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	url: string,
	body?: DTO,
	query?: DTO,
	init?: RequestInit
): Promise<RO | HTTPError> {
	try {
		// TODO
		let jwt: any = null;
		if (chrome) {
			const a = await chrome.storage.local.get('jwt');
			jwt = a.jwt;
		}
		const params = query ? `?${createSearchParams(query)}` : '';
		const resp = await fetch(`${url}${params}`, {
			...init,
			headers: {
				Authorization: `Bearer ${jwt}`,
				'Content-Type': 'application/json; charset=utf-8',
				...init?.headers,
			},
			method,
			body: JSON.stringify(body),
		});
		if (resp.ok) {
			return await resp.json();
		}
		return new HTTPError(resp.status, await resp.json());
	} catch {
		return new HTTPError(500, 'Unknown error');
	}
}

function createSearchParams<DTO>(data: DTO): URLSearchParams {
	const searchParamsData: Record<string, string> = {};
	for (const key in data) {
		if (typeof data[key] === 'object') {
			searchParamsData[key] = JSON.stringify(data[key]);
			continue;
		}
		searchParamsData[key] = String(data[key]);
	}
	return new URLSearchParams(searchParamsData);
}
