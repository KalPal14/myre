import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { NodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository';
import { INodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository.interface';
import { NodesService } from '~/highlight-extension/services/nodes-service/nodes.service';
import { INodesService } from '~/highlight-extension/services/nodes-service/nodes.service.interface';

export const nodesBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<INodesRepository>(TYPES.NodesRepository).to(NodesRepository);
	bind<INodesService>(TYPES.NodesService).to(NodesService);
});
