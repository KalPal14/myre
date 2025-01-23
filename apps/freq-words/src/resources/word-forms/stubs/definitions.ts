import { DeepPartial } from 'typeorm';

import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../../languages/stubs/languages';
import { Definition } from '../entities/definition.entity';

import {
	LEMMA_ENTITY,
	SYNONYMS_ENTITIES,
	TRANSLATIONS_ENTITIES,
	WORD_FORM_ENTITY,
} from './word-forms';

export const DEFINITION_LEMMA_RUSSIAN_ENTITY: DeepPartial<Definition> = {
	id: 1,
	description: 'Действие, нарушающее закон и подлежащее уголовной ответственности.',
	language: RUSSIAN_LANGUAGE_ENTITY,
	wordForm: LEMMA_ENTITY,
	synonyms: SYNONYMS_ENTITIES,
};

export const DEFINITION_LEMMA_ENGLISH_ENTITY: DeepPartial<Definition> = {
	id: 2,
	description:
		'an action or omission that constitutes an offense that may be prosecuted by the state and is punishable by law.',
	language: ENGLISH_LANGUAGE_ENTITY,
	wordForm: LEMMA_ENTITY,
	synonyms: TRANSLATIONS_ENTITIES,
};

export const DEFINITION_WORD_FORM_RUSSIAN_ENTITY: DeepPartial<Definition> = {
	id: 3,
	description: 'Действие, нарушающее закон и подлежащее уголовной ответственности.',
	language: RUSSIAN_LANGUAGE_ENTITY,
	wordForm: WORD_FORM_ENTITY,
	synonyms: SYNONYMS_ENTITIES,
};

export const DEFINITION_WORD_FORM_ENGLISH_ENTITY: DeepPartial<Definition> = {
	id: 4,
	description:
		'an action or omission that constitutes an offense that may be prosecuted by the state and is punishable by law.',
	language: ENGLISH_LANGUAGE_ENTITY,
	wordForm: WORD_FORM_ENTITY,
	synonyms: TRANSLATIONS_ENTITIES,
};
