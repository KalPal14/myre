import { injectable } from 'inversify';

import { Page } from '../page';

import { IPageFactory } from './page-factory.interface';

@injectable()
export class PageFactory implements IPageFactory {
	create(pageData: Page): Page {
		return new Page(pageData.workspaceId, pageData.url);
	}
}
