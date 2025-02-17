import { HTTPError } from '~libs/common/errors/http-error/http-error';
import { BrowserStorageBaseApiService } from '~libs/client-core/services/api-service/infrastracture/browser-storage-base-api.service';
import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';
import { IMessageSender } from '~libs/client-core/adapters/browser/types/message-sender.interface';

import { IApiRequestIncomeMsg } from './types/api-request.income-msg.interface';

export async function apiRequestHandler<DTO>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<DTO>,
	sender: IMessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const api = new BrowserStorageBaseApiService();
	const resp = await api[method](url, data);

	browserAdapter.tabs.sendMessage(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		isDataHttpError: resp instanceof HTTPError,
		incomeData: data,
	});
}
