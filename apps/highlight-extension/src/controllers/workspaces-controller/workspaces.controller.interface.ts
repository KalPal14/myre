import { Router } from 'express';

import { TController } from '~libs/express-core';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/highlight-extension';

export interface IWorkspacesController {
	router: Router;

	get: TController<{ id: string }>;
	getAllOwners: TController;
	create: TController<null, CreateWorkspaceDto>;
	update: TController<{ id: string }, UpdateWorkspaceDto>;
	delete: TController<{ id: string }>;
}
