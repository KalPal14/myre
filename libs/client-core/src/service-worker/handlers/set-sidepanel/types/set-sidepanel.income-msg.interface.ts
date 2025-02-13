import { IBaseMsg } from '~libs/client-core/service-worker/types/base.msg.interface';

export interface ISetSidepanelIncomeMsg extends IBaseMsg {
	serviceWorkerHandler: 'setSidepanel';
	url: string;
	enabled: boolean;
}
