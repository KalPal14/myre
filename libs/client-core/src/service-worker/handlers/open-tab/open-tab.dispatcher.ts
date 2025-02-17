import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';

import { IOpenTabIncomeMsg } from './types/open-tab.income-msg.interface';

export function dispatchOpenTab({ url }: Omit<IOpenTabIncomeMsg, 'serviceWorkerHandler'>): void {
	browserAdapter.runtime.sendMessage({
		serviceWorkerHandler: 'openTab',
		url,
	});
}
