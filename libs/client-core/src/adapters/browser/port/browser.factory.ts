import { BrowserInfo, detect } from 'detect-browser';

import { chromeAdapter } from '../infrastructure/chrome.adapter';
import { firefoxAdapter } from '../infrastructure/firefox.adapter';

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
				return firefoxAdapter;
			default:
				return chromeAdapter;
		}
	}
}
