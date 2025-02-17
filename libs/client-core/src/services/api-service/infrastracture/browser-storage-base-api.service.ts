import { browserAdapter } from '~libs/client-core';
import { ApiService } from '~libs/common';

export class BrowserStorageBaseApiService extends ApiService {
	protected async getJwt(): Promise<string | undefined> {
		const { jwt } = await browserAdapter.storage.local.get('jwt');
		return jwt;
	}
}
