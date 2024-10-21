import { Router } from 'express';

import {
	GetHighlightsDto,
	CreateHighlightDto,
	UpdateHighlightDto,
	IndividualUpdateHighlightsDto,
} from '~libs/dto/highlight-extension';
import { TController } from '~libs/express-core';

export interface IHighlightsController {
	router: Router;

	getMany: TController<null, null, GetHighlightsDto>;
	create: TController<null, CreateHighlightDto>;
	update: TController<{ id: string }, UpdateHighlightDto>;
	individualUpdateMany: TController<null, IndividualUpdateHighlightsDto>;
	delete: TController<{ id: string }>;
}
