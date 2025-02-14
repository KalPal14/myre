import { browserAdapter } from '~libs/client-core';

import { IOpenTabIncomeMsg } from './types/open-tab.income-msg.interface';

export async function openTabHandler({ url }: IOpenTabIncomeMsg): Promise<void> {
	browserAdapter.tabs.create({ url });
}
