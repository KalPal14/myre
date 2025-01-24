import { IWordFormRo } from '../word-forms/word-form.ro';
import { IWordFormMarkRo } from '../word-marks/common/word-form-mark.ro';

import { IBaseSourceRo } from './common/base-source.ro';

export interface IGetSourceRo extends IBaseSourceRo {
	wordFormMarks: IWordFormMarkRo<Omit<IWordFormRo, 'definitions'>>[];
}
