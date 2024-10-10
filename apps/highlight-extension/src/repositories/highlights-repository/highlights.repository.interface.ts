import { IBatchPayload } from '~libs/common';
import { UpdateHighlightDto, IndividualUpdateHighlightsDto } from '~libs/dto/highlight-extension';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';

import { THighlightDeepModel } from './types/highlight-deep-model.type';

export interface IHighlightsRepository {
	create: (highlight: Highlight) => Promise<THighlightDeepModel>;
	update: (
		id: number,
		payload: Omit<UpdateHighlightDto, 'startContainer' | 'endContainer'>
	) => Promise<THighlightDeepModel>;
	updateMany: (ids: number[], payload: Partial<HighlightModel>) => Promise<IBatchPayload>;
	individualUpdateMany: (data: IndividualUpdateHighlightsDto) => Promise<THighlightDeepModel[]>;
	findById: (id: number) => Promise<THighlightDeepModel | null>;
	findAllByIds: (isd: number[]) => Promise<THighlightDeepModel[]>;
	findAllByPageId: (pageId: number) => Promise<THighlightDeepModel[] | null>;
	delete: (id: number) => Promise<HighlightModel>;
}
