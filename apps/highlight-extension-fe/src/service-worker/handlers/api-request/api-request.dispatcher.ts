import { TRoLimiter } from '~/highlight-extension-fe/common/services/api.service.interface';
import IApiRequestIncomeMsg from '~/highlight-extension-fe/service-worker/types/income-msgs/api-request.income-msg.interface';

export default function apiRequestDispatcher<RO extends TRoLimiter = undefined>({
	contentScriptsHandler,
	url,
	method,
	data = undefined,
}: Omit<IApiRequestIncomeMsg<RO>, 'serviceWorkerHandler'>): void {
	chrome.runtime.sendMessage<IApiRequestIncomeMsg<RO>>({
		serviceWorkerHandler: 'apiRequest',
		contentScriptsHandler,
		method,
		url,
		data,
	});
}
