import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Definition } from '~/freq-words/resources/translator/entities/definition.entity';
import {
	DEFINITION_LEMMA_ENGLISH_ENTITY,
	DEFINITION_LEMMA_RUSSIAN_ENTITY,
	DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
} from '~/freq-words/resources/translator/mocks/definitions';

export default class DefinitionSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "definition" RESTART IDENTITY CASCADE;');

		const repository = dataSource.getRepository(Definition);
		await repository.save([
			DEFINITION_LEMMA_ENGLISH_ENTITY,
			DEFINITION_LEMMA_RUSSIAN_ENTITY,
			DEFINITION_WORD_FORM_ENGLISH_ENTITY,
			DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
		]);
	}
}
