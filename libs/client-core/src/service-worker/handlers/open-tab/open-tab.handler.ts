import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';

import { IOpenTabIncomeMsg } from './types/open-tab.income-msg.interface';

export async function openTabHandler({ url }: IOpenTabIncomeMsg): Promise<void> {
	browserAdapter.tabs.create({ url });
}
