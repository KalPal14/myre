import { v4 } from 'uuid';

import { browserAdapter } from '~libs/client-core/adapters/browser/browser.adapter';
import { HTTPError } from '~libs/common/errors/http-error/http-error';

import { IApiRequestIncomeMsg } from './types/api-request.income-msg.interface';
import { IApiRequestOutcomeMsg } from './types/api-request.outcome-msg.interface';

export interface IDispatchApiReqest<DTO, RO> {
	msg: Omit<IApiRequestIncomeMsg<DTO>, 'serviceWorkerHandler' | 'contentScriptsHandler'>;
	onSuccess: (outcomeMsg: RO) => void;
	onError?: (err: HTTPError) => void;
}

export function dispatchApiRequest<DTO, RO>({
	msg,
	onSuccess,
	onError,
}: IDispatchApiReqest<DTO, RO>): void {
	browserAdapter.runtime.onMessage.addListener(apiResponseMsgHandler);

	const contentScriptsHandler = `apiHandler_${v4()}`;
	browserAdapter.runtime.sendMessage({
		serviceWorkerHandler: 'apiRequest',
		contentScriptsHandler,
		...msg,
	});

	function apiResponseMsgHandler(outcomeMsg: IApiRequestOutcomeMsg): void {
		if (outcomeMsg.contentScriptsHandler !== contentScriptsHandler) return;
		if (outcomeMsg.isDataHttpError) {
			onError?.(outcomeMsg.data as HTTPError);
		} else {
			onSuccess(outcomeMsg.data as RO);
		}
		browserAdapter.runtime.onMessage.removeListener(apiResponseMsgHandler);
	}
}
