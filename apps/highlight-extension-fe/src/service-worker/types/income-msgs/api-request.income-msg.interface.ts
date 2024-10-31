import * as api from '~libs/common/utils/helper-functions/api';

import IBaseMsg from '../base.msg.interface';

export default interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof typeof api;
	url: string;
	data?: DTO;
}
