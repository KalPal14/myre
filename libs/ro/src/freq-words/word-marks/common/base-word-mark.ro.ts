import { IWordFormRo } from '../../word-forms/word-form.ro';

import { IWordFormMarkRo } from './word-form-mark.ro';

export interface IBaseWordMarkRo<WordForm extends Partial<IWordFormRo>> {
	id: number;
	count: number;
	wordFormMarks: IWordFormMarkRo<WordForm>[];
}
