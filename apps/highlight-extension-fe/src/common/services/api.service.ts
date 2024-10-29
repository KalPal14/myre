import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';

import CHROME_STOREGE_KEYS from '../constants/chrome-storage-keys';

import IApiServise from './api.service.interface';

export default class ApiServise implements IApiServise {
	private initRequest: RequestInit;

	constructor(initRequest?: Omit<RequestInit, 'method' | 'body'>) {
		this.initRequest = {
			...initRequest,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				...initRequest?.headers,
			},
		};
	}

	private createSearchParams<DTO>(data: DTO): URLSearchParams {
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

	async get<DTO, RO>(url: string, data?: DTO): Promise<RO | HTTPError> {
		try {
			const { jwt } = await chrome.storage.local.get(CHROME_STOREGE_KEYS.jwt);
			const params = data ? `?${this.createSearchParams(data)}` : '';
			const resp = await fetch(`${url}${params}`, {
				...this.initRequest,
				headers: {
					Authorization: `Bearer ${jwt}`,
					...this.initRequest.headers,
				},
				method: 'GET',
			});
			if (resp.ok) {
				return await resp.json();
			}
			return new HTTPError(resp.status, await resp.json());
		} catch {
			return new HTTPError(500, 'Unknown error');
		}
	}

	private async fetchLayout<DTO, RO>(
		method: 'POST' | 'PATCH' | 'DELETE',
		url: string,
		data?: DTO
	): Promise<RO | HTTPError> {
		try {
			const { jwt } = await chrome.storage.local.get(CHROME_STOREGE_KEYS.jwt);
			const resp = await fetch(`${url}`, {
				...this.initRequest,
				headers: {
					Authorization: `Bearer ${jwt}`,
					...this.initRequest.headers,
				},
				method,
				body: JSON.stringify(data),
			});
			if (resp.ok) {
				return await resp.json();
			}
			return new HTTPError(resp.status, await resp.json());
		} catch {
			return new HTTPError(500, 'Unknown error');
		}
	}

	async post<DTO, RO>(url: string, data?: DTO): Promise<RO | HTTPError> {
		return await this.fetchLayout('POST', url, data);
	}

	async patch<DTO, RO>(url: string, data?: DTO): Promise<RO | HTTPError> {
		return await this.fetchLayout('PATCH', url, data);
	}

	async delete<DTO, RO>(url: string, data?: DTO): Promise<RO | HTTPError> {
		return await this.fetchLayout('DELETE', url, data);
	}
}
