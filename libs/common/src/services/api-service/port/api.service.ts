import { HTTPError } from '~libs/common/errors/http-error/http-error';

export interface IApiServiceReqOptions extends RequestInit {
	jwt?: string;
}

export abstract class ApiService {
	protected abstract getJwt(): Promise<string | undefined>;

	get<DTO, RO>(url: string, data?: DTO, init?: IApiServiceReqOptions): Promise<RO | HTTPError> {
		return this.fetchLayout('GET', url, undefined, data, init);
	}

	post<DTO, RO>(url: string, data?: DTO, init?: IApiServiceReqOptions): Promise<RO | HTTPError> {
		return this.fetchLayout('POST', url, data, undefined, init);
	}

	patch<DTO, RO>(url: string, data?: DTO, init?: IApiServiceReqOptions): Promise<RO | HTTPError> {
		return this.fetchLayout('PATCH', url, data, undefined, init);
	}

	delete<DTO, RO>(url: string, data?: DTO, init?: IApiServiceReqOptions): Promise<RO | HTTPError> {
		return this.fetchLayout('DELETE', url, data, undefined, init);
	}

	private async fetchLayout<DTO, RO>(
		method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
		url: string,
		body?: DTO,
		query?: DTO,
		init?: IApiServiceReqOptions
	): Promise<RO | HTTPError> {
		try {
			const jwt = init?.jwt ?? (await this.getJwt());
			const params = query ? `?${this.createSearchParams(query)}` : '';
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
			return new HTTPError(500, 'Something went wrong. Please try again');
		}
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
}
