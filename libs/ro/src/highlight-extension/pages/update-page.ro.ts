import { IBasePageRo } from './common/base-page.ro';

export interface IUpdatePageRo extends Omit<IBasePageRo, 'highlights'> {}
