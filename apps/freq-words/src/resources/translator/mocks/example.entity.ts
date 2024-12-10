import { LANGUAGE_ENGLISH } from '../../languages/mocks/languages';
import { Example } from '../entities/example.entity';

import { DICTIONARY_LEMMA, DICTIONARY } from './dictionary.entity';

export const EXAMPLE_LEMMA: Example = {
	id: 1,
	language: LANGUAGE_ENGLISH,
	dictionary: DICTIONARY_LEMMA,
};

export const EXAMPLE: Example = {
	id: 2,
	language: LANGUAGE_ENGLISH,
	dictionary: DICTIONARY,
};
