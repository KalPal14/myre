import { WordFormMark } from '../entities/word-form-mark.entity';

import { WORD_MARK } from './words-marks';
import { WORD_FORM_LEMMA, WORD_FORM } from './word-forms';

export const WORD_FORM_MARK_LEMMA: WordFormMark = {
	id: 1,
	count: 1,
	isLemma: true,
	wordMark: WORD_MARK,
	wordForm: WORD_FORM_LEMMA,
	sources: [],
};

export const WORD_FORM_MARK: WordFormMark = {
	id: 2,
	count: 2,
	isLemma: false,
	wordMark: WORD_MARK,
	wordForm: WORD_FORM,
	sources: [],
};
