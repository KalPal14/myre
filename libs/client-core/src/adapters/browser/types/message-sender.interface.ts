import { ITab } from './tab.interface';

export interface IMessageSender {
	tab?: ITab;
	frameId?: number;
	id?: string;
	url?: string;
	tlsChannelId?: string;
}
