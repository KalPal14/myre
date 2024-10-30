import openTabHandler from './handlers/open-tab/open-tab.handler';
import apiRequestHandler from './handlers/api-request/api-request.handler';
import IBaseMsg from './types/base.msg.interface';
import IApiRequestIncomeMsg from './types/income-msgs/api-request.income-msg.interface';
import IOpenTabIncomeMsg from './types/income-msgs/open-tab.income-msg.interface';
import setSidepanelHandler from './handlers/set-sidepanel/open-sidepanel.handler';
import ISetSidepanelIncomeMsg from './types/income-msgs/set-sidepanel.income-msg.interface';

chrome.runtime.onMessage.addListener(async function <DTO>(
	msg: IBaseMsg,
	sender: chrome.runtime.MessageSender
) {
	switch (msg.serviceWorkerHandler) {
		case 'apiRequest':
			apiRequestHandler(msg as IApiRequestIncomeMsg<DTO>, sender);
			return;
		case 'openTab':
			openTabHandler(msg as IOpenTabIncomeMsg);
			return;
		case 'openSidepanel':
			setSidepanelHandler(msg as ISetSidepanelIncomeMsg, sender);
	}
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url || !tabId) return;
	await chrome.storage.local.set({ ['unfoundHighlightsIds']: [] });
	chrome.sidePanel.setOptions({
		tabId,
		path: `sidepanel.html?url=${tab.url}`,
		enabled: true,
	});
});
