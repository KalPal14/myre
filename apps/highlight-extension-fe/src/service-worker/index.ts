import { browserAdapter } from '~libs/client-core/adapters/browser/port/browser.adapter';
import { swHandlerFactory } from '~libs/client-core/service-worker/sw-handler.factory';

swHandlerFactory();

browserAdapter.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url || !tabId) return;
	await browserAdapter.storage.local.set({ ['unfoundHighlightsIds']: [] });
	browserAdapter.sidePanel.setOptions({
		tabId,
		path: `sidepanel.html?url=${tab.url}`,
		enabled: true,
	});
});
