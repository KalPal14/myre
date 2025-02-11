import type { ApiService } from '~libs/common/services/api-service/port/api.service';

import { IBaseMsg } from '../base.msg.interface';

export interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof ApiService;
	url: string;
	data?: DTO;
}
