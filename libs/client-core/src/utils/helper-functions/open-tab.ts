import { browserAdapter } from '~libs/client-core';

export function openTab(url: string): void {
	window.open(browserAdapter.runtime.getURL(url));
}
