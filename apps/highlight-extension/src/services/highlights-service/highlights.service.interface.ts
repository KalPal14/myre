import { IJwtPayload } from '~libs/express-core';
import {
	CreateHighlightDto,
	UpdateHighlightDto,
	IndividualUpdateHighlightsDto,
} from '~libs/dto/highlight-extension';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { THighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.type';

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
