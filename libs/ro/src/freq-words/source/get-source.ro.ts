import { IWordFormMarkRo } from '../words/common/word-form-mark.ro';
import { IWordFormRo } from '../words/common/word-form.ro';

import { IBaseSourceRo } from './common/base-source.ro';

export interface IGetSourceRo extends IBaseSourceRo {
	wordFormsMarks: IWordFormMarkRo<Omit<IWordFormRo, 'definitions'>>[];
}
