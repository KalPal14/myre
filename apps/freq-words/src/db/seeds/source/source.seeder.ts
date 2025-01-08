import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Source } from '~/freq-words/resources/source/entities/source.entity';
import { SOURCE_ENTITY } from '~/freq-words/resources/source/mocks/sources';

export default class SourceSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "source" RESTART IDENTITY CASCADE;');

		const repository = dataSource.getRepository(Source);
		await repository.insert([SOURCE_ENTITY]);
	}
}
