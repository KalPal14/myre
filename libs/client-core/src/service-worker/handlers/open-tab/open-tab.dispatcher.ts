import { IOpenTabIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/open-tab.income-msg.interface';

export function openTabDispatcher({ url }: Omit<IOpenTabIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IOpenTabIncomeMsg>({
		serviceWorkerHandler: 'openTab',
		url,
	});
}
