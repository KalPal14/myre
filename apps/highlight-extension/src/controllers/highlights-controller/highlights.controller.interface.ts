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

	getHighlights: TController<null, null, GetHighlightsDto>;
	createHighlight: TController<null, CreateHighlightDto>;
	updateHighlight: TController<{ id: string }, UpdateHighlightDto>;
	individualUpdateHighlights: TController<null, IndividualUpdateHighlightsDto>;
	deleteHighlight: TController<{ id: string }>;
}
