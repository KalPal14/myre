import IApiServise from '~/highlight-extension-fe/common/services/api.service.interface';

import IBaseMsg from '../base.msg.interface';

export default interface IApiRequestIncomeMsg<DTO = undefined> extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	method: keyof IApiServise;
	url: string;
	data?: DTO;
}
