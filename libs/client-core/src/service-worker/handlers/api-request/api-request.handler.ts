import { HTTPError } from '~libs/common/errors/http-error/http-error';
import { ChromeStorageBaseApiService } from '~libs/common/services/api-service/infrastracture/chrome-storage-base-api.service';
import { browserAdapter } from '~libs/client-core';
import { IMessageSender } from '~libs/client-core/adapters/browser/port/types/message-sender.interface';

import { IApiRequestIncomeMsg } from './types/api-request.income-msg.interface';

export async function apiRequestHandler<DTO>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<DTO>,
	sender: IMessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const api = new ChromeStorageBaseApiService();
	const resp = await api[method](url, data);

	browserAdapter.tabs.sendMessage(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		isDataHttpError: resp instanceof HTTPError,
		incomeData: data,
	});
}
