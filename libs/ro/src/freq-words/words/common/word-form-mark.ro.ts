import { IWordFormRo } from './word-form.ro';

export interface IWordFormMarkRo<WordForm extends Partial<IWordFormRo>> {
	id: number;
	count: number;
	isLemma: boolean;
	wordForm: WordForm;
}
