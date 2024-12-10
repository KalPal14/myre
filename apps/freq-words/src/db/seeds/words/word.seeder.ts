import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Word } from '~/freq-words/resources/words/entities/word.entity';
import { WORD } from '~/freq-words/resources/words/mocks/words';

export default class WordSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "word" RESTART IDENTITY;');

		const repository = dataSource.getRepository(Word);
		await repository.insert([WORD]);
	}
}
