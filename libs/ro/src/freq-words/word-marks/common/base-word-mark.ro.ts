import { IWordFormMarkRo } from './word-form-mark.ro';
import { IWordFormRo } from './word-form.ro';

export interface IBaseWordMarkRo<WordForm extends Partial<IWordFormRo>> {
	id: number;
	count: number;
	wordFormMarks: IWordFormMarkRo<WordForm>[];
}
