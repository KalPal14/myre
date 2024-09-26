import { ContainerModule, interfaces } from 'inversify';

import TYPES from '@/common/constants/types.inversify';
import { PagesController } from '@/controllers/pages-controller/pages.controller';
import { IPagesController } from '@/controllers/pages-controller/pages.controller.interface';
import { PagesRepository } from '@/repositories/pages-repository/pages.repository';
import { IPagesRepository } from '@/repositories/pages-repository/pages.repository.interface';
import { PagesServise } from '@/services/pages-service/pages.service';
import { IPagesServise } from '@/services/pages-service/pages.service.interface';

export const pageBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IPagesRepository>(TYPES.PagesRepository).to(PagesRepository);
	bind<IPagesServise>(TYPES.PagesServise).to(PagesServise);
	bind<IPagesController>(TYPES.PagesController).to(PagesController);
});
