import { IBaseMsg } from '~libs/client-core/service-worker/types/base.msg.interface';

export interface IOpenTabIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'openTab';
	url: string;
}
