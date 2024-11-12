import { IBaseMsg } from '../base.msg.interface';

export interface IOpenTabIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'openTab';
	url: string;
}
