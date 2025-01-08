import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';
import {
	ENGLISH_LANGUAGE_ENTITY,
	RUSSIAN_LANGUAGE_ENTITY,
	URKAINIAN_LANGUAGE_ENTITY,
} from '~/freq-words/resources/languages/mocks/languages';

export default class LanguageSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "language" RESTART IDENTITY CASCADE;');

		const repository = dataSource.getRepository(Language);
		await repository.insert([
			ENGLISH_LANGUAGE_ENTITY,
			RUSSIAN_LANGUAGE_ENTITY,
			URKAINIAN_LANGUAGE_ENTITY,
			{ name: 'German' },
			{ name: 'Portuguese' },
			{ name: 'Arabic' },
			{ name: 'Greek' },
			{ name: 'Romanian' },
			{ name: 'Bulgarian' },
			{ name: 'Hungarian' },
			{ name: 'Chinese' },
			{ name: 'Indonesian' },
			{ name: 'Slovak' },
			{ name: 'Czech' },
			{ name: 'Italian' },
			{ name: 'Slovenian' },
			{ name: 'Danish' },
			{ name: 'Japanese' },
			{ name: 'Spanish' },
			{ name: 'Dutch' },
			{ name: 'Latvian' },
			{ name: 'Estonian' },
			{ name: 'Lithuanian' },
			{ name: 'Finnish' },
			{ name: 'Swedish' },
			{ name: 'Turkish' },
			{ name: 'Norwegian' },
			{ name: 'French' },
			{ name: 'Polish' },
		]);
	}
}
