import { Router } from 'express';

import { TController } from '../common/types/controller.type';

import { CreateHighlightDto } from '@/dto/highlights/create-highlight.dto';
import { GetHighlightsDto } from '@/dto/highlights/get-highlights.dto';
import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';
import { IndividualUpdateHighlightsDto } from '@/dto/highlights/individual-update-highlights.dto';

export interface IHighlightsController {
	router: Router;

	getHighlights: TController<null, null, GetHighlightsDto>;
	createHighlight: TController<null, CreateHighlightDto>;
	updateHighlight: TController<{ id: string }, UpdateHighlightDto>;
	individualUpdateHighlights: TController<null, IndividualUpdateHighlightsDto>;
	deleteHighlight: TController<{ id: string }>;
}
