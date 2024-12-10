import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { WordFormMark } from '~/freq-words/resources/words/entities/word-form-mark.entity';
import { WORD_FORM_MARK } from '~/freq-words/resources/words/mocks/word-forms-marks';
import { WORD_FORM_LEMMA } from '~/freq-words/resources/words/mocks/word-forms';

export default class WordFormMarkSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "word_form_mark" RESTART IDENTITY;');

		const repository = dataSource.getRepository(WordFormMark);
		await repository.insert([WORD_FORM_MARK, WORD_FORM_LEMMA]);
	}
}
