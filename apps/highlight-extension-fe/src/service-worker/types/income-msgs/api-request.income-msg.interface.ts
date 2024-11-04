import type { ChromeExtApiService } from '~libs/common';

import IBaseMsg from '../base.msg.interface';

export default interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof ChromeExtApiService;
	url: string;
	data?: DTO;
}
