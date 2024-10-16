import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/highlight-extension';

import { WorkspaceModel } from '~/highlight-extension/prisma/client';

export interface IWorkspacesService {
	get: (id: number) => Promise<WorkspaceModel>;
	getAllOwners: (ownerId: number) => Promise<WorkspaceModel[]>;
	create: (ownerId: number, payload: CreateWorkspaceDto) => Promise<WorkspaceModel>;
	update: (id: number, payload: UpdateWorkspaceDto) => Promise<WorkspaceModel>;
	delete: (id: number) => Promise<WorkspaceModel>;
}
