import { TGetSourcesRo } from '../../source/get-sources.ro';
import { IWordFormRo } from '../../word-forms/word-form.ro';

export interface IWordFormMarkRo<WordForm extends Partial<IWordFormRo>> {
	id: number;
	count: number;
	isLemma: boolean;
	wordForm: WordForm;
	sources: TGetSourcesRo;
}
