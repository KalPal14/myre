import { apiRequestHandler } from '~libs/client-core/service-worker/handlers/api-request/api-request.handler';
import { openTabHandler } from '~libs/client-core/service-worker/handlers/open-tab/open-tab.handler';
import { setSidepanelHandler } from '~libs/client-core/service-worker/handlers/set-sidepanel/open-sidepanel.handler';
import { IBaseMsg } from '~libs/client-core/service-worker/types/base.msg.interface';
import { IApiRequestIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/api-request.income-msg.interface';
import { IOpenTabIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/open-tab.income-msg.interface';
import { ISetSidepanelIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/set-sidepanel.income-msg.interface';

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
