import { IWordRo } from './word.ro';

export interface IWordFormMark {
	id: number;
	count: number;
	wordMarkId: number;
	word: IWordRo;
}
