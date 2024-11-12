import { IBaseMsg } from '../base.msg.interface';

export interface ISetSidepanelIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'openSidepanel';
	url: string;
	enabled: boolean;
}
