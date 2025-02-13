import { v4 } from 'uuid';

import { HTTPError } from '~libs/common';

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
	chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

	const contentScriptsHandler = `apiHandler_${v4()}`;
	chrome.runtime.sendMessage<IApiRequestIncomeMsg<DTO>>({
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
		chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
	}
}
