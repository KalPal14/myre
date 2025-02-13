import { apiRequestHandler } from './handlers/api-request/api-request.handler';
import { IApiRequestIncomeMsg } from './handlers/api-request/types/api-request.income-msg.interface';
import { openTabHandler } from './handlers/open-tab/open-tab.handler';
import { IOpenTabIncomeMsg } from './handlers/open-tab/types/open-tab.income-msg.interface';
import { setSidepanelHandler } from './handlers/set-sidepanel/set-sidepanel.handler';
import { ISetSidepanelIncomeMsg } from './handlers/set-sidepanel/types/set-sidepanel.income-msg.interface';
import { IBaseMsg } from './types/base.msg.interface';

export function swHandlerFactory(): void {
	chrome.runtime.onMessage.addListener(async function <DTO>(
		msg: IBaseMsg,
		sender: chrome.runtime.MessageSender
	) {
		switch (msg.serviceWorkerHandler) {
			case 'apiRequest':
				apiRequestHandler(msg as IApiRequestIncomeMsg<DTO>, sender);
				return;
			case 'openTab':
				openTabHandler(msg as IOpenTabIncomeMsg);
				return;
			case 'setSidepanel':
				setSidepanelHandler(msg as ISetSidepanelIncomeMsg, sender);
		}
	});
}
