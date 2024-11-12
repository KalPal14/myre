import { HTTPError } from '~libs/common/errors/http-error/http-error';
import { chromeExtApi } from '~libs/common/services/api-service/chrome-ext-api.service';
import { IApiRequestIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/api-request.income-msg.interface';
import { IApiRequestOutcomeMsg } from '~libs/client-core/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';

export async function apiRequestHandler<DTO>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<DTO>,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const resp = await chromeExtApi[method](url, data);

	chrome.tabs.sendMessage<IApiRequestOutcomeMsg>(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		isDataHttpError: resp instanceof HTTPError,
		incomeData: data,
	});
}
