import { BaseApiService } from './base-api-servise/base-api.service';

export class ApiService extends BaseApiService {
	protected async getJwt(): Promise<string | undefined> {
		return undefined;
	}
}

export const api = new ApiService();
