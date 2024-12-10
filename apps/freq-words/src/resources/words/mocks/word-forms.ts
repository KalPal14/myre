import { LANGUAGE_ENGLISH } from '../../languages/mocks/languages';
import { WordForm } from '../entities/word-form.entity';

import { WORD } from './words';

export const WORD_FORM_LEMMA: WordForm = {
	id: 1,
	name: 'keep',
	language: LANGUAGE_ENGLISH,
	word: WORD,
	dictionaries: [],
	wordFormMarks: [],
};

export const WORD_FORM: WordForm = {
	id: 1,
	name: 'kept',
	language: LANGUAGE_ENGLISH,
	word: WORD,
	dictionaries: [],
	wordFormMarks: [],
};
