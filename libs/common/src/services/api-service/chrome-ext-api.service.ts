import { BaseApiService } from './base-api-servise/base-api.service';

export class ChromeExtApiService extends BaseApiService {
	protected async getJwt(): Promise<string | undefined> {
		const { jwt } = await chrome.storage.local.get('jwt');
		return jwt;
	}
}

export const chromeExtApi = new ChromeExtApiService();
