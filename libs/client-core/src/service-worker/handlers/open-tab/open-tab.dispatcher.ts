import { IOpenTabIncomeMsg } from './types/open-tab.income-msg.interface';

export function dispatchOpenTab({ url }: Omit<IOpenTabIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IOpenTabIncomeMsg>({
		serviceWorkerHandler: 'openTab',
		url,
	});
}
