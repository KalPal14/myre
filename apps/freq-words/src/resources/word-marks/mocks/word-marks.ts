import { randomUUID } from 'crypto';

import { DeepPartial } from 'typeorm';

import { UpsertWordMarkDto } from '~libs/dto/freq-words';

import { WordMark } from '../entities/word-mark.entity';
import { WORKSPACE_ENTITY } from '../../workspaces/mocks/workspaces';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../../languages/mocks/languages';
import {
	DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
} from '../../word-forms/mocks/definitions';
import { SOURCE_ENTITY } from '../../source/mocks/sources';
import {
	EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES,
	EXAMPLES_ENGLISH_WORD_FORM_ENTITIES,
} from '../../word-forms/mocks/examples';
import {
	LEMMA_ENTITY,
	WORD_FORM_ENTITY,
	SYNONYMS_ENTITIES,
	TRANSLATIONS_ENTITIES,
} from '../../word-forms/mocks/word-forms';

export const WORD_MARK_ENTITY: DeepPartial<WordMark> = {
	id: 1,
	count: 3,
	workspace: WORKSPACE_ENTITY,
};

export const UPSERT_WORD_MARK_DTO = (
	lemmaAndWordForm: 'equal' | 'differ' | 'lemma-free',
	existed?: boolean,
	withSource?: boolean
): UpsertWordMarkDto => {
	let lemma: string | null = null;
	if (lemmaAndWordForm !== 'lemma-free') {
		lemma = existed ? LEMMA_ENTITY.name! : `word_${randomUUID()}`;
	}

	let wordForm: string = existed ? WORD_FORM_ENTITY.name! : `word_${randomUUID()}`!;
	if (lemmaAndWordForm === 'equal') {
		wordForm = lemma!;
	}

	return {
		workspaceId: WORKSPACE_ENTITY.id!,
		wordForm,
		lemma,
		sourceLink: withSource ? SOURCE_ENTITY.link : undefined,
		definitionFrom: {
			languageId: RUSSIAN_LANGUAGE_ENTITY.id!,
			synonyms: SYNONYMS_ENTITIES.map(({ name }) => name!),
			description: DEFINITION_WORD_FORM_RUSSIAN_ENTITY.description!,
			examples: EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES.map(({ phrase }) => phrase!),
		},
		definitionTo: {
			languageId: ENGLISH_LANGUAGE_ENTITY.id!,
			synonyms: TRANSLATIONS_ENTITIES.map(({ name }) => name!),
			description: DEFINITION_WORD_FORM_ENGLISH_ENTITY.description!,
			examples: EXAMPLES_ENGLISH_WORD_FORM_ENTITIES.map(({ phrase }) => phrase!),
		},
	};
};
