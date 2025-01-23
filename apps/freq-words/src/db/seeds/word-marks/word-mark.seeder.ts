import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { WordMark } from '~/freq-words/resources/word-marks/entities/word-mark.entity';
import { WORD_MARK_ENTITY } from '~/freq-words/resources/word-marks/stubs/word-marks';

export default class WordMarkSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "word_mark" RESTART IDENTITY CASCADE;');

		const repository = dataSource.getRepository(WordMark);
		await repository.insert([WORD_MARK_ENTITY]);
	}
}
