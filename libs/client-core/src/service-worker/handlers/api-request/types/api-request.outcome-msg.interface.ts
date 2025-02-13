import { IBaseMsg } from '~libs/client-core/service-worker/types/base.msg.interface';

export interface IApiRequestOutcomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'apiRequest';
	contentScriptsHandler: string;
	data: unknown;
	isDataHttpError: boolean;
	incomeData: unknown;
}
