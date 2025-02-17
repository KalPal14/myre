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
