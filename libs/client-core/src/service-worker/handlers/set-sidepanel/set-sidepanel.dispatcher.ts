import { ISetSidepanelIncomeMsg } from './types/set-sidepanel.income-msg.interface';

export function dispatchSetSidepanel({
	url,
	enabled,
}: Omit<ISetSidepanelIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage({
		url,
		enabled,
		serviceWorkerHandler: 'setSidepanel',
	});
}
