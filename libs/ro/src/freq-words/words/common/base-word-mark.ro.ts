import { IWordRo } from './word.ro';

export interface IBaseWordMarkRo<Word extends IWordRo | Omit<IWordRo, 'definitions'>> {
	id: number;
	count: number;
	wordFormsMarks: {
		id: number;
		count: number;
		isLemma: boolean;
		wordForm: Word;
	}[];
}
