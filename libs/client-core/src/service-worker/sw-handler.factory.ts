import { browserAdapter } from '~libs/client-core/adapters/browser/port/browser.adapter';

import { apiRequestHandler } from './handlers/api-request/api-request.handler';
import { openTabHandler } from './handlers/open-tab/open-tab.handler';
import { setSidepanelHandler } from './handlers/set-sidepanel/set-sidepanel.handler';

export function swHandlerFactory(): void {
	console.log('swHandlerFactory');
	browserAdapter.runtime.onMessage.addListener((msg, sender) => {
		console.log('LISTENER!!');
		switch (msg.serviceWorkerHandler) {
			case 'apiRequest':
				console.log('apiRequest!!');
				apiRequestHandler(msg, sender);
				return;
			case 'openTab':
				console.log('openTab!!');

				openTabHandler(msg);
				return;
			case 'setSidepanel':
				console.log('setSidepanel!!');

				setSidepanelHandler(msg, sender);
		}
	});
}
