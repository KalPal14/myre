import { Workspace } from '~/highlight-extension/domain/workspace/workspace';
import { WorkspaceModel } from '~/highlight-extension/prisma/client';

import { IWorkspaceDeepModel } from './types/workspace-deep-model.interface';

export interface IWorkspacesRepository {
	findBy: (
		workspaceData: Partial<Omit<WorkspaceModel, 'colors'>>
	) => Promise<WorkspaceModel | null>;
	deepFindBy: (
		workspaceData: Partial<Omit<WorkspaceModel, 'colors'>>
	) => Promise<IWorkspaceDeepModel | null>;
	findManyBy: (workspaceData: Partial<Omit<WorkspaceModel, 'colors'>>) => Promise<WorkspaceModel[]>;

	create: (workspace: Workspace) => Promise<WorkspaceModel>;
	update: (id: number, payload: Partial<Workspace>) => Promise<WorkspaceModel>;
	delete: (id: number) => Promise<WorkspaceModel>;
}
