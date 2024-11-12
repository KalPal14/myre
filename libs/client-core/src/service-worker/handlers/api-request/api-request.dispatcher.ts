import { IApiRequestIncomeMsg } from '~libs/client-core/service-worker/types/income-msgs/api-request.income-msg.interface';

export function apiRequestDispatcher<DTO = undefined>({
	contentScriptsHandler,
	url,
	method,
	data = undefined,
}: Omit<IApiRequestIncomeMsg<DTO>, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IApiRequestIncomeMsg<DTO>>({
		serviceWorkerHandler: 'apiRequest',
		contentScriptsHandler,
		method,
		url,
		data,
	});
}
