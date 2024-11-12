import { IOpenTabIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/open-tab.income-msg.interface';

export async function openTabHandler({ url }: IOpenTabIncomeMsg): Promise<void> {
	chrome.tabs.create({ url });
}
