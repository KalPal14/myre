import { IBasePageRo } from './common/base-page.ro';

export interface IGetPagesRoItem extends Omit<IBasePageRo, 'highlights'> {
	highlightsCount: number;
	notesCount: number;
}

export type TGetPagesRo = IGetPagesRoItem[];
