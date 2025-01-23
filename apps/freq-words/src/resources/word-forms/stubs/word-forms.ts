import { DeepPartial } from 'typeorm';

import { WordForm } from '../entities/word-form.entity';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../../languages/stubs/languages';

export const LEMMA_ENTITY: DeepPartial<WordForm> = {
	id: 1,
	name: 'преступление',
	language: RUSSIAN_LANGUAGE_ENTITY,
};

export const WORD_FORM_ENTITY: DeepPartial<WordForm> = {
	id: 2,
	name: 'преступлением',
	language: RUSSIAN_LANGUAGE_ENTITY,
};

export const SYNONYMS_ENTITIES: DeepPartial<WordForm>[] = [
	{
		id: 3,
		name: 'прегрешение',
		language: RUSSIAN_LANGUAGE_ENTITY,
	},
	{
		id: 4,
		name: 'провинность',
		language: RUSSIAN_LANGUAGE_ENTITY,
	},
	{
		id: 5,
		name: 'провинность',
		language: RUSSIAN_LANGUAGE_ENTITY,
	},
];

export const TRANSLATIONS_ENTITIES: DeepPartial<WordForm>[] = [
	{
		id: 6,
		name: 'crime',
		language: ENGLISH_LANGUAGE_ENTITY,
	},
	{
		id: 7,
		name: 'offense',
		language: ENGLISH_LANGUAGE_ENTITY,
	},
	{
		id: 8,
		name: 'felony',
		language: ENGLISH_LANGUAGE_ENTITY,
	},
];
