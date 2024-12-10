import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { WordMark } from '~/freq-words/resources/words/entities/word-mark.entity';
import { WORD_MARK } from '~/freq-words/resources/words/mocks/words-marks';

export default class WordMarkSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "word_mark" RESTART IDENTITY;');

		const repository = dataSource.getRepository(WordMark);
		await repository.insert([WORD_MARK]);
	}
}
