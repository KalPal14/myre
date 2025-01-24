import { IWordFormRo } from '../word-forms/word-form.ro';

import { IBaseWordMarkRo } from './common/base-word-mark.ro';

export type TGetWordMarksRo = IBaseWordMarkRo<Omit<IWordFormRo, 'definitions'>>[];
