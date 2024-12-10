import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Dictionary } from '~/freq-words/resources/translator/entities/dictionary.entity';
import {
	DICTIONARY,
	DICTIONARY_LEMMA,
} from '~/freq-words/resources/translator/mocks/dictionary.entity';

export default class DictionarySeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "dictionary" RESTART IDENTITY;');

		const repository = dataSource.getRepository(Dictionary);
		await repository.insert([DICTIONARY, DICTIONARY_LEMMA]);
	}
}
