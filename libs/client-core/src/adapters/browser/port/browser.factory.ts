import { BrowserInfo, detect } from 'detect-browser';

import { IBrowser } from './browser.interface';

export class BrowserFactory {
	browserInfo: BrowserInfo;

	constructor() {
		const browserInfo = detect();

		if (browserInfo instanceof BrowserInfo) {
			this.browserInfo = browserInfo;
		} else {
			throw new Error('failed to detect browser');
		}
	}

	create(): IBrowser {
		switch (this.browserInfo.name) {
			case 'firefox':
				return {
					storage: browser.storage,
					sidePanel: browser.sidebarAction
						? {
								setOptions: (details): Promise<void> =>
									browser.sidebarAction.setPanel({ ...details, panel: details.path ?? null }),
								open: browser.sidebarAction.open,
							}
						: {
								setOptions: async () => undefined,
								open: async () => undefined,
							},
					tabs: browser.tabs,
					runtime: browser.runtime,
				};
			default:
				return {
					storage: chrome.storage,
					sidePanel: chrome.sidePanel,
					tabs: chrome.tabs,
					runtime: chrome.runtime,
				};
		}
	}
}

// export function browserFactory(): IBrowser {
// 	if (browser) {
// 		return {
// 			storage: browser.storage,
// 			sidePanel: {
// 				setOptions: (details) =>
// 					browser.sidebarAction.setPanel({ ...details, panel: details.path ?? null }),
// 				open: browser.sidebarAction.open,
// 			},
// 			tabs: browser.tabs,
// 			runtime: browser.runtime,
// 		};
// 	}
// 	if (chrome) {
// 		return {
// 			storage: chrome.storage,
// 			sidePanel: chrome.sidePanel,
// 			tabs: chrome.tabs,
// 			runtime: chrome.runtime,
// 		};
// 	}
// 	return {
// 		storage: {
// 			local: {
// 				get: async (key) => ({ key }),
// 				set: async () => undefined,
// 				onChanged: {
// 					addListener: () => undefined,
// 					removeListener: () => undefined,
// 					hasListener: () => false,
// 				},
// 			},
// 		},
// 		sidePanel: {
// 			setOptions: async () => undefined,
// 			open: async () => undefined,
// 		},
// 		tabs: {
// 			onUpdated: {
// 				addListener: () => undefined,
// 				removeListener: () => undefined,
// 				hasListener: () => false,
// 			},
// 			create: async () => ({ index: 1, incognito: false }),
// 			sendMessage: async () => undefined,
// 		},
// 		runtime: {
// 			sendMessage: async () => undefined,
// 			onMessage: {
// 				addListener: () => undefined,
// 				removeListener: () => undefined,
// 				hasListener: () => false,
// 			},
// 			getURL: (url) => url,
// 		},
// 	};
// }
