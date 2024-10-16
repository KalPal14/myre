import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { WorkspacesController } from '~/highlight-extension/controllers/workspaces-controller/workspaces.controller';
import { IWorkspacesController } from '~/highlight-extension/controllers/workspaces-controller/workspaces.controller.interface';
import { IWorkspaceFactory } from '~/highlight-extension/domain/workspace/factory/workspace-factory.interface';
import { WorkspaceFactory } from '~/highlight-extension/domain/workspace/factory/workspace.factory';
import { WorkspacesRepository } from '~/highlight-extension/repositories/workspaces-repository/workspaces.repository';
import { IWorkspacesRepository } from '~/highlight-extension/repositories/workspaces-repository/workspaces.repository.interface';
import { WorkspacesService } from '~/highlight-extension/services/workspaces-service/workspaces.service';
import { IWorkspacesService } from '~/highlight-extension/services/workspaces-service/workspaces.service.interface';

export const workspaceBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IWorkspacesController>(TYPES.WorkspacesController).to(WorkspacesController);
	bind<IWorkspacesRepository>(TYPES.WorkspacesRepository).to(WorkspacesRepository);
	bind<IWorkspacesService>(TYPES.WorkspacesService).to(WorkspacesService);
	bind<IWorkspaceFactory>(TYPES.WorkspaceFactory).to(WorkspaceFactory);
});
