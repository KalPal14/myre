import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';
import { WORKSPACE } from '~/freq-words/resources/workspaces/mocks/workspaces';

export default class WorkspaceSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "workspace" RESTART IDENTITY;');

		const repository = dataSource.getRepository(Workspace);
		await repository.insert([WORKSPACE]);
	}
}
