import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { INodeFactory } from '~/highlight-extension/domain/node/factory/node-factory.interface';
import { NodeFactory } from '~/highlight-extension/domain/node/factory/node.factory';
import { NodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository';
import { INodesRepository } from '~/highlight-extension/repositories/nodes-repository/nodes.repository.interface';
import { NodesService } from '~/highlight-extension/services/nodes-service/nodes.service';
import { INodesService } from '~/highlight-extension/services/nodes-service/nodes.service.interface';

export const nodesBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<INodesRepository>(TYPES.NodesRepository).to(NodesRepository);
	bind<INodesService>(TYPES.NodesService).to(NodesService);
	bind<INodeFactory>(TYPES.NodeFactory).to(NodeFactory);
});
