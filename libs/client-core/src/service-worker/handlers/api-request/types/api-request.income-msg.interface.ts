import { IBaseMsg } from '~libs/client-core/service-worker/types/base.msg.interface';
import type { ApiService } from '~libs/common/services/api-service/port/api.service';

export interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof ApiService;
	url: string;
	data?: DTO;
}
