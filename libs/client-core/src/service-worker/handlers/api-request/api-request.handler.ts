import { HTTPError } from '~libs/common/errors/http-error/http-error';
import { ChromeStorageBaseApiService } from '~libs/common/services/api-service/infrastracture/chrome-storage-base-api.service';

import { IApiRequestIncomeMsg } from './types/api-request.income-msg.interface';
import { IApiRequestOutcomeMsg } from './types/api-request.outcome-msg.interface';

export async function apiRequestHandler<DTO>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<DTO>,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const api = new ChromeStorageBaseApiService();
	const resp = await api[method](url, data);

	chrome.tabs.sendMessage<IApiRequestOutcomeMsg>(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		isDataHttpError: resp instanceof HTTPError,
		incomeData: data,
	});
}
