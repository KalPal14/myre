import { CrossBrowserStateBuilder } from '../port/cross-browser-state-builder';
import { IBrowserStorage } from '../port/types/browser-storage.interface';

export class CrossChromeStateBuilder<
	State extends Record<string, any>,
> extends CrossBrowserStateBuilder<State> {
	protected storage: IBrowserStorage = {
		get: (key) => chrome.storage.local.get(key) as State[keyof State],
		set: (state) => chrome.storage.local.set(state),
		onChanged: {
			addListener: (callback) => {
				chrome.storage.onChanged.addListener((newState) => {
					const [key, { newValue }] = Object.entries(newState)[0];
					callback(key, newValue);
				});
			},
			removeListener: (callback) => {
				chrome.storage.onChanged.removeListener((newState) => {
					const [key, { newValue }] = Object.entries(newState)[0];
					callback(key, newValue);
				});
			},
		},
	};
}
