import { ContainerModule, interfaces } from 'inversify';

import TYPES from '@/common/constants/types.inversify';
import { NodesRepository } from '@/repositories/nodes-repository/nodes.repository';
import { INodesRepository } from '@/repositories/nodes-repository/nodes.repository.interface';
import { NodesService } from '@/services/nodes-service/nodes.service';
import { INodesService } from '@/services/nodes-service/nodes.service.interface';

export const nodesBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<INodesRepository>(TYPES.NodesRepository).to(NodesRepository);
	bind<INodesService>(TYPES.NodesService).to(NodesService);
});
