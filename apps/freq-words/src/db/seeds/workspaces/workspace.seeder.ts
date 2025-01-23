import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';
import { WORKSPACE_ENTITY } from '~/freq-words/resources/workspaces/stubs/workspaces';

export default class WorkspaceSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await dataSource.query('TRUNCATE "workspace" RESTART IDENTITY CASCADE;');

		const repository = dataSource.getRepository(Workspace);
		await repository.insert([WORKSPACE_ENTITY]);
	}
}
