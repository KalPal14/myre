import IApiRequestIncomeMsg from '~/highlight-extension-fe/service-worker/types/income-msgs/api-request.income-msg.interface';

export default function apiRequestDispatcher<DTO = undefined>({
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
