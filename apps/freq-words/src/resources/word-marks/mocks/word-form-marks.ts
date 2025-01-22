import { DeepPartial } from 'typeorm';

import { WordFormMark } from '../entities/word-form-mark.entity';
import { SOURCE_ENTITY } from '../../source/mocks/sources';

import { WORD_MARK_ENTITY } from './word-marks';
import { LEMMA_ENTITY, WORD_FORM_ENTITY } from './word-forms';

export const LEMMA_MARK_ENTITY: DeepPartial<WordFormMark> = {
	id: 1,
	isLemma: true,
	count: 1,
	wordMark: WORD_MARK_ENTITY,
	wordForm: LEMMA_ENTITY,
};

export const WORD_FORM_MARK_ENTITY: DeepPartial<WordFormMark> = {
	id: 2,
	count: 2,
	isLemma: false,
	wordMark: WORD_MARK_ENTITY,
	wordForm: WORD_FORM_ENTITY,
	sources: [SOURCE_ENTITY],
};
