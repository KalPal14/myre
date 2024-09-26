import { ContainerModule, interfaces } from 'inversify';

import TYPES from '@/common/constants/types.inversify';
import { HighlightsController } from '@/controllers/highlights-controller/highlights.controller';
import { IHighlightsController } from '@/controllers/highlights-controller/highlights.controller.interface';
import { HighlightsRepository } from '@/repositories/highlights-repository/highlights.repository';
import { IHighlightsRepository } from '@/repositories/highlights-repository/highlights.repository.interface';
import { HighlightsService } from '@/services/highlights-service/highlights.service';
import { IHighlightsService } from '@/services/highlights-service/highlights.service.interface';

export const highlightBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IHighlightsController>(TYPES.HighlightsController).to(HighlightsController);
	bind<IHighlightsRepository>(TYPES.HighlightsRepository).to(HighlightsRepository);
	bind<IHighlightsService>(TYPES.HighlightsService).to(HighlightsService);
});
