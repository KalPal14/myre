import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { HighlightsController } from '~/highlight-extension/controllers/highlights-controller/highlights.controller';
import { IHighlightsController } from '~/highlight-extension/controllers/highlights-controller/highlights.controller.interface';
import { HighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { HighlightsService } from '~/highlight-extension/services/highlights-service/highlights.service';
import { IHighlightsService } from '~/highlight-extension/services/highlights-service/highlights.service.interface';

export const highlightBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IHighlightsController>(TYPES.HighlightsController).to(HighlightsController);
	bind<IHighlightsRepository>(TYPES.HighlightsRepository).to(HighlightsRepository);
	bind<IHighlightsService>(TYPES.HighlightsService).to(HighlightsService);
});
