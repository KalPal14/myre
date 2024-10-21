import {
	CreateHighlightDto,
	UpdateHighlightDto,
	IndividualUpdateHighlightsDto,
} from '~libs/dto/highlight-extension';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { IHighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.interface';

export interface IHighlightsService {
	get: (id: number) => Promise<IHighlightDeepModel>;
	getMany: (ids: number[]) => Promise<IHighlightDeepModel[]>;
	create: (highlightData: CreateHighlightDto) => Promise<IHighlightDeepModel>;
	update: (id: number, payload: UpdateHighlightDto) => Promise<IHighlightDeepModel>;
	individualUpdateMany: (data: IndividualUpdateHighlightsDto) => Promise<IHighlightDeepModel[]>;
	delete: (id: number) => Promise<HighlightModel>;
}
