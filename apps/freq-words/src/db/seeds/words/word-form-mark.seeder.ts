import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { WordFormMark } from '~/freq-words/resources/words/entities/word-form-mark.entity';
import {
	LEMMA_MARK_ENTITY,
	WORD_FORM_MARK_ENTITY,
} from '~/freq-words/resources/words/mocks/word-forms-marks';

export default class WordFormMarkSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		const repository = dataSource.getRepository(WordFormMark);
		await repository.save([LEMMA_MARK_ENTITY, WORD_FORM_MARK_ENTITY]);
	}
}
