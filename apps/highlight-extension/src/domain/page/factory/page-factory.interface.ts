import { Page } from '../page';

export interface IPageFactoryCreateArgs extends Omit<Page, 'highlights'> {
	highlights?: number[];
}

export interface IPageFactory {
	create: (nodeData: IPageFactoryCreateArgs) => Page;
}
