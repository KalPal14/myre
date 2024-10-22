import IOpenTabIncomeMsg from '~/highlight-extension-fe/service-worker/types/income-msgs/open-tab.income-msg.interface';

export default async function openTabHandler({ url }: IOpenTabIncomeMsg): Promise<void> {
	chrome.tabs.create({ url });
}
