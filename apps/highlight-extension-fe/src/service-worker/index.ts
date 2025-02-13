import { swHandlerFactory } from '~libs/client-core/service-worker/sw-handler.factory';

swHandlerFactory();

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url || !tabId) return;
	await chrome.storage.local.set({ ['unfoundHighlightsIds']: [] });
	chrome.sidePanel.setOptions({
		tabId,
		path: `sidepanel.html?url=${tab.url}`,
		enabled: true,
	});
});
