import { IWordRo } from './word.ro';

export interface IBaseWordMarkRo {
	id: number;
	workspaceId: number;
	count: number;
	lemmaMark: IWordRo;
	wordFormMarks: IWordRo[];
}
