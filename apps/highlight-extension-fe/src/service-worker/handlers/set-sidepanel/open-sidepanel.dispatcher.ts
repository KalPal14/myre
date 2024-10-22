import ISetSidepanelIncomeMsg from '~/highlight-extension-fe/service-worker/types/income-msgs/set-sidepanel.income-msg.interface';

export default function setSidepanelDispatcher({
	url,
	enabled,
}: Omit<ISetSidepanelIncomeMsg, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage({
		url,
		enabled,
		serviceWorkerHandler: 'openSidepanel',
	});
}
