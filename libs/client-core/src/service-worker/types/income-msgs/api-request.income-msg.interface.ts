import type { ChromeStorageBaseAoiService } from '~libs/common';

import { IBaseMsg } from '../base.msg.interface';

export interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof ChromeStorageBaseAoiService;
	url: string;
	data?: DTO;
}
