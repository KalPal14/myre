import { DeepPartial } from 'typeorm';

import {
	DEFINITION_LEMMA_ENGLISH_ENTITY,
	DEFINITION_LEMMA_RUSSIAN_ENTITY,
	DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
} from '../../word-forms/mocks/definitions';
import { Example } from '../entities/example.entity';

export const EXAMPLES_RUSSIAN_LEMMA_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 1,
		phrase: 'Он пытался помешать вооруженному товарищу совершить преступление.',
		definition: DEFINITION_LEMMA_RUSSIAN_ENTITY,
	},
	{
		id: 2,
		phrase: 'В целом это было преступление колоссальных масштабов.',
		definition: DEFINITION_LEMMA_RUSSIAN_ENTITY,
	},
];

export const EXAMPLES_ENGLISH_LEMMA_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 3,
		phrase: 'He tried to prevent an armed companion to commit the crime.',
		definition: DEFINITION_LEMMA_ENGLISH_ENTITY,
	},
	{
		id: 4,
		phrase: 'In sum, it was a crime of the most colossal proportions.',
		definition: DEFINITION_LEMMA_ENGLISH_ENTITY,
	},
];

export const EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 5,
		phrase: 'Игнорировать предпочтения этих пользователей было бы преступлением.',
		definition: DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
	},
	{
		id: 6,
		phrase: 'Здесь наказание явно не соотносится с преступлением.',
		definition: DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
	},
];

export const EXAMPLES_ENGLISH_WORD_FORM_ENTITIES: DeepPartial<Example>[] = [
	{
		id: 7,
		phrase: 'To ignore the preferences of these users would be a crime.',
		definition: DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	},
	{
		id: 8,
		phrase: 'Clearly, the punishment here does not fit the crime.',
		definition: DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	},
];
