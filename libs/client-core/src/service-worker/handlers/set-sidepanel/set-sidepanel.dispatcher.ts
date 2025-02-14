import { browserAdapter } from '~libs/client-core';

import { ISetSidepanelIncomeMsg } from './types/set-sidepanel.income-msg.interface';

export function dispatchSetSidepanel({
	url,
	enabled,
}: Omit<ISetSidepanelIncomeMsg, 'serviceWorkerHandler'>): void {
	browserAdapter.runtime.sendMessage({
		url,
		enabled,
		serviceWorkerHandler: 'setSidepanel',
	});
}
