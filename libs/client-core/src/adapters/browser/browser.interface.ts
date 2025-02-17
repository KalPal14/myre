import { IMessageSender } from './types/message-sender.interface';
import { ISetPanelDetails } from './types/set-panel-details.interface';
import { ITab } from './types/tab.interface';
import { IWebExtEvent } from './types/web-ext-event.interface';

export interface IBrowser {
	tabs: {
		onUpdated: IWebExtEvent<(tabId: number, info: any, tab: ITab) => Promise<void>>;
		sendMessage: (tabId: number, msg: any) => Promise<any>;
		create: (tabInfo: { url: string }) => Promise<ITab>;
	};
	storage: {
		local: {
			get: (key: string) => Promise<Record<string, any>>;
			set: (state: Record<string, any>) => Promise<void>;
			onChanged: IWebExtEvent<
				(changes: Record<string, { oldValue?: any; newValue?: any }>) => void
			>;
		};
	};
	runtime: {
		onMessage: IWebExtEvent<
			(
				message: any,
				sender: IMessageSender,
				sendResponse: (response?: any) => void
			) => boolean | Promise<any> | void
		>;
		sendMessage: (message: any) => Promise<any>;
		getURL: (path: string) => string;
	};
	sidePanel: {
		setOptions(details: ISetPanelDetails): Promise<void>;
		open: (options: { tabId: number }) => Promise<void>;
	};
}
