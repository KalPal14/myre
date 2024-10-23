import { IBasePageRo } from './common/base-page.ro';

export interface IGetPageRoEmpty {
	id: null;
}

export type TGetPageRo = IGetPageRoEmpty | IBasePageRo;
