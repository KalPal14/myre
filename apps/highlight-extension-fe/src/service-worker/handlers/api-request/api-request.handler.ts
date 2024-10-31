import * as api from '~libs/common/utils/helper-functions/api';
import { HTTPError } from '~libs/common';

import IApiRequestIncomeMsg from '~/highlight-extension-fe/service-worker/types/income-msgs/api-request.income-msg.interface';
import IApiRequestOutcomeMsg from '~/highlight-extension-fe/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';

export default async function apiRequestHandler<DTO>(
	{ method, url, data, contentScriptsHandler, serviceWorkerHandler }: IApiRequestIncomeMsg<DTO>,
	sender: chrome.runtime.MessageSender
): Promise<void> {
	if (!sender.tab?.id) return;

	const resp = await api[method](url, data);

	chrome.tabs.sendMessage<IApiRequestOutcomeMsg>(sender.tab.id, {
		serviceWorkerHandler,
		contentScriptsHandler,
		data: resp,
		isDataHttpError: resp instanceof HTTPError,
		incomeData: data,
	});
}
