import { Router } from 'express';

import { TController } from '~libs/express-core';

import { CreateHighlightDto } from '~/highlight-extension/dto/highlights/create-highlight.dto';
import { GetHighlightsDto } from '~/highlight-extension/dto/highlights/get-highlights.dto';
import { UpdateHighlightDto } from '~/highlight-extension/dto/highlights/update-highlight.dto';
import { IndividualUpdateHighlightsDto } from '~/highlight-extension/dto/highlights/individual-update-highlights.dto';

export interface IHighlightsController {
	router: Router;

	getHighlights: TController<null, null, GetHighlightsDto>;
	createHighlight: TController<null, CreateHighlightDto>;
	updateHighlight: TController<{ id: string }, UpdateHighlightDto>;
	individualUpdateHighlights: TController<null, IndividualUpdateHighlightsDto>;
	deleteHighlight: TController<{ id: string }>;
}
