import { ISetSidepanelIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/set-sidepanel.income-msg.interface';

export function setSidepanelDispatcher({
	url,
	enabled,
}: Omit<ISetSidepanelIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage({
		url,
		enabled,
		serviceWorkerHandler: 'openSidepanel',
	});
}
