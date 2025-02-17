import { browserAdapter } from '~libs/client-core/adapters/browser/port/browser.adapter';

import { apiRequestHandler } from './handlers/api-request/api-request.handler';
import { openTabHandler } from './handlers/open-tab/open-tab.handler';
import { setSidepanelHandler } from './handlers/set-sidepanel/set-sidepanel.handler';

export function swHandlerFactory(): void {
	browserAdapter.runtime.onMessage.addListener((msg, sender) => {
		switch (msg.serviceWorkerHandler) {
			case 'apiRequest':
				apiRequestHandler(msg, sender);
				return;
			case 'openTab':
				openTabHandler(msg);
				return;
			case 'setSidepanel':
				setSidepanelHandler(msg, sender);
				return;
		}
	});
}
