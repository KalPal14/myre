import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';
import { ApiService } from '~libs/common/services/api-service/port/api.service';

export class BrowserStorageBaseApiService extends ApiService {
	protected async getJwt(): Promise<string | undefined> {
		const { jwt } = await browserAdapter.storage.local.get('jwt');
		return jwt;
	}
}
