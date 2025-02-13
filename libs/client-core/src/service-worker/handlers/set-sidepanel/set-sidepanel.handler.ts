import { ISetSidepanelIncomeMsg } from './types/set-sidepanel.income-msg.interface';

export async function setSidepanelHandler(
	{ url, enabled }: ISetSidepanelIncomeMsg,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;
	chrome.sidePanel.setOptions({
		tabId: sender.tab.id,
		path: `sidepanel.html?url=${url}`,
		enabled,
	});
	await chrome.sidePanel.open({ tabId: sender.tab.id });
}
