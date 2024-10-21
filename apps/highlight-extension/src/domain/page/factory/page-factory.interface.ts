import { Page } from '../page';

export interface IPageFactory {
	create: (nodeData: Page) => Page;
}
