import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';

import CHROME_STOREGE_KEYS from '../constants/chrome-storage-keys';

import IApiServise, { TRoLimiter } from './api.service.interface';

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

	private createSearchParams<RO extends TRoLimiter>(data: RO): URLSearchParams {
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

	async get<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		try {
			const { jwt } = await chrome.storage.local.get(CHROME_STOREGE_KEYS.jwt);
			const params = data ? `?${this.createSearchParams(data)}` : '';
			const resp = await fetch(`${url}${params}`, {
				...this.initRequest,
				headers: {
					...this.initRequest.headers,
					Authorization: `Bearer ${jwt}`,
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

	private async fetchLayout<RO extends TRoLimiter, DTO>(
		method: 'POST' | 'PATCH' | 'DELETE',
		url: string,
		data?: RO
	): Promise<DTO | HTTPError> {
		try {
			const { jwt } = await chrome.storage.local.get(CHROME_STOREGE_KEYS.jwt);
			const resp = await fetch(`${url}`, {
				...this.initRequest,
				headers: {
					...this.initRequest.headers,
					Authorization: `Bearer ${jwt}`,
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

	async post<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		return await this.fetchLayout('POST', url, data);
	}

	async patch<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		return await this.fetchLayout('PATCH', url, data);
	}

	async delete<RO extends TRoLimiter, DTO>(url: string, data?: RO): Promise<DTO | HTTPError> {
		return await this.fetchLayout('DELETE', url, data);
	}
}
