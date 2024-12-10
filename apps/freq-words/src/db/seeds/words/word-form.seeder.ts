import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { WordForm } from '~/freq-words/resources/words/entities/word-form.entity';
import { WORD_FORM, WORD_FORM_LEMMA } from '~/freq-words/resources/words/mocks/word-forms';

export default class WordFormSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "word_form" RESTART IDENTITY;');

		const repository = dataSource.getRepository(WordForm);
		await repository.insert([WORD_FORM, WORD_FORM_LEMMA]);
	}
}
