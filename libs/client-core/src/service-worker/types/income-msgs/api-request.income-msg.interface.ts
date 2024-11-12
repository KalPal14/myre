import type { ChromeExtApiService } from '~libs/common/services/api-service/chrome-ext-api.service';

import { IBaseMsg } from '../base.msg.interface';

export interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof ChromeExtApiService;
	url: string;
	data?: DTO;
}
