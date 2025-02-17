import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';
import { IMessageSender } from '~libs/client-core/adapters/browser/types/message-sender.interface';

import { ISetSidepanelIncomeMsg } from './types/set-sidepanel.income-msg.interface';

export async function setSidepanelHandler(
	{ url, enabled }: ISetSidepanelIncomeMsg,
	sender: IMessageSender
): Promise<void> {
	if (!sender.tab?.id) return;
	browserAdapter.sidePanel.setOptions({
		tabId: sender.tab.id,
		path: `sidepanel.html?url=${url}`,
		enabled,
	});
	await browserAdapter.sidePanel.open({ tabId: sender.tab.id });
}
