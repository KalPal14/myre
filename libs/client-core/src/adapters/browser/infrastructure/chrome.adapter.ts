import { IBrowser } from '../port/browser.interface';

export const chromeAdapter: IBrowser = {
	storage: chrome.storage,
	sidePanel: chrome.sidePanel,
	tabs: chrome.tabs,
	runtime: chrome.runtime,
};
