// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { DataSource } from 'typeorm';

// import { Definition } from '~/freq-words/resources/translator/entities/definition.entity';
// import {
// 	DEFINITION,
// 	DEFINITION_LEMMA,
// } from '~/freq-words/resources/translator/mocks/definition.entity';

// export default class DefinitionSeeder implements Seeder {
// 	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
// 		await dataSource.query('TRUNCATE "definition" RESTART IDENTITY;');

// 		const repository = dataSource.getRepository(Definition);
// 		await repository.insert([DEFINITION, DEFINITION_LEMMA]);
// 	}
// }
