// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { DataSource } from 'typeorm';

// import { Example } from '~/freq-words/resources/translator/entities/example.entity';
// import { EXAMPLE, EXAMPLE_LEMMA } from '~/freq-words/resources/translator/mocks/example.entity';

// export default class ExampleSeeder implements Seeder {
// 	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
// 		await dataSource.query('TRUNCATE "example" RESTART IDENTITY;');

// 		const repository = dataSource.getRepository(Example);
// 		await repository.insert([EXAMPLE, EXAMPLE_LEMMA]);
// 	}
// }
