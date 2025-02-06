import { ApiService } from '../port/api.service';

export class ChromeStorageBaseAoiService extends ApiService {
	protected async getJwt(): Promise<string | undefined> {
		const { jwt } = await chrome.storage.local.get('jwt');
		return jwt;
	}
}
