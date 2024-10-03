import { IJwtPayload } from '~libs/express-core';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { CreateHighlightDto } from '~/highlight-extension/dto/highlights/create-highlight.dto';
import { UpdateHighlightDto } from '~/highlight-extension/dto/highlights/update-highlight.dto';
import { THighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.type';
import { IndividualUpdateHighlightsDto } from '~/highlight-extension/dto/highlights/individual-update-highlights.dto';

export interface IHighlightsService {
	getHighlights: (ids: number[]) => Promise<THighlightDeepModel[]>;
	createHighlight: (
		highlightData: CreateHighlightDto,
		user: IJwtPayload
	) => Promise<THighlightDeepModel>;
	updateHighlight: (
		id: number,
		payload: UpdateHighlightDto
	) => Promise<THighlightDeepModel | Error>;
	individualUpdateHighlights: (
		data: IndividualUpdateHighlightsDto
	) => Promise<THighlightDeepModel[]>;
	deleteHighlight: (id: number) => Promise<HighlightModel | Error>;
}
