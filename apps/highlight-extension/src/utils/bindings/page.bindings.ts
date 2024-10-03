import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { PagesController } from '~/highlight-extension/controllers/pages-controller/pages.controller';
import { IPagesController } from '~/highlight-extension/controllers/pages-controller/pages.controller.interface';
import { PagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { PagesServise } from '~/highlight-extension/services/pages-service/pages.service';
import { IPagesServise } from '~/highlight-extension/services/pages-service/pages.service.interface';

export const pageBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IPagesRepository>(TYPES.PagesRepository).to(PagesRepository);
	bind<IPagesServise>(TYPES.PagesServise).to(PagesServise);
	bind<IPagesController>(TYPES.PagesController).to(PagesController);
});
