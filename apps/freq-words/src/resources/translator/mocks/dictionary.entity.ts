import { LANGUAGE_ENGLISH } from '../../languages/mocks/languages';
import { WORD_FORM_LEMMA, WORD_FORM } from '../../words/mocks/word-forms';
import { Dictionary } from '../entities/dictionary.entity';

export const DICTIONARY_LEMMA: Dictionary = {
	id: 1,
	description:
		'Verb that means to hold onto something or to not let it go. It can also mean to continue doing something or to maintain a certain state.',
	language: LANGUAGE_ENGLISH,
	wordForm: WORD_FORM_LEMMA,
	synonyms: [],
	examples: [],
};

export const DICTIONARY: Dictionary = {
	id: 2,
	description:
		'Past tense of the verb "keep." It means to have continued to hold, maintain, or store something. It can also mean to have caused something to remain in a certain state.',
	language: LANGUAGE_ENGLISH,
	wordForm: WORD_FORM,
	synonyms: [],
	examples: [],
};
