import { injectable } from 'inversify';

import { Page } from '../page';

import { IPageFactory, IPageFactoryCreateArgs } from './page-factory.interface';

@injectable()
export class PageFactory implements IPageFactory {
	create(pageData: IPageFactoryCreateArgs): Page {
		return new Page(pageData.userId, pageData.url, pageData.highlights);
	}
}
