import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { WordForm } from '~/freq-words/resources/word-forms/entities/word-form.entity';
import {
	LEMMA_ENTITY,
	SYNONYMS_ENTITIES,
	TRANSLATIONS_ENTITIES,
	WORD_FORM_ENTITY,
} from '~/freq-words/resources/word-forms/stubs/word-forms';

export default class WordFormSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "word_form_mark" RESTART IDENTITY CASCADE;');

		const repository = dataSource.getRepository(WordForm);
		await repository.insert([
			LEMMA_ENTITY,
			WORD_FORM_ENTITY,
			...SYNONYMS_ENTITIES,
			...TRANSLATIONS_ENTITIES,
		]);
	}
}
