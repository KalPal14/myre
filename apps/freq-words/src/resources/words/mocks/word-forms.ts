import { LANGUAGE_ENGLISH } from '../../languages/mocks/languages';
import { WordForm } from '../entities/word-form.entity';

export const WORD_FORM_LEMMA: WordForm = {
	id: 1,
	name: 'keep',
	isLemma: true,
	language: LANGUAGE_ENGLISH,
	// dictionaries: [],
	wordFormsMarks: [],
};

export const WORD_FORM: WordForm = {
	id: 1,
	name: 'kept',
	isLemma: false,
	language: LANGUAGE_ENGLISH,
	// dictionaries: [],
	wordFormsMarks: [],
};
