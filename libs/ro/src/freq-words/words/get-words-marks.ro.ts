import { IBaseWordMarkRo } from './common/base-word-mark.ro';
import { IWordRo } from './common/word.ro';

export type TGetWordsMarksRo = IBaseWordMarkRo<Omit<IWordRo, 'definitions'>>[];
