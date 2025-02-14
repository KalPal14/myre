import { browserAdapter } from '~libs/client-core';

import { ApiService } from '../port/api.service';
// TODO
export class ChromeStorageBaseApiService extends ApiService {
	protected async getJwt(): Promise<string | undefined> {
		const { jwt } = await browserAdapter.storage.local.get('jwt');
		return jwt;
	}
}
