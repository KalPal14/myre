import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';

import { Workspace } from '~/highlight-extension/domain/workspace/workspace';
import { WorkspaceModel } from '~/highlight-extension/prisma/client';

export const WORKSPACE: Workspace = {
	ownerId: 1,
	name: 'Workspace 1',
	colors: ['#000', '#fff'],
};

export const WORKSPACE_MODEL: WorkspaceModel = {
	id: 1,
	...WORKSPACE,
};

export const CREATE_WORKSPACE_DTO: CreateWorkspaceDto = {
	name: 'New Workspace',
	colors: [],
};
