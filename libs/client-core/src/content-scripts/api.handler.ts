import { v4 } from 'uuid';

import { HTTPError } from '~libs/common';

import { apiRequestDispatcher } from '../service-worker/handlers/api-request/api-request.dispatcher';
import { IApiRequestIncomeMsg } from '../service-worker/types/income-msgs/api-request.income-msg.interface';
import { IApiRequestOutcomeMsg } from '../service-worker/types/outcome-msgs/api-request.outcome-msg.interface';

export interface IApiHandlerParams<DTO, RO> {
	msg: Omit<IApiRequestIncomeMsg<DTO>, 'serviceWorkerHandler' | 'contentScriptsHandler'>;
	onSuccess: (outcomeMsg: RO) => void;
	onError?: (err: HTTPError) => void;
}

export function apiHandler<DTO, RO>({ msg, onSuccess, onError }: IApiHandlerParams<DTO, RO>): void {
	chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

	const contentScriptsHandler = `apiHandler_${v4()}`;
	apiRequestDispatcher<DTO>({
		...msg,
		contentScriptsHandler,
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
