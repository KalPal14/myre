import { IOpenTabIncomeMsg } from './types/open-tab.income-msg.interface';

export async function openTabHandler({ url }: IOpenTabIncomeMsg): Promise<void> {
	chrome.tabs.create({ url });
}
