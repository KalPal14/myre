import { IBatchPayload } from '~libs/common';
import { IndividualUpdateHighlightsDto } from '~libs/dto/highlight-extension';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';

import { IHighlightDeepModel } from './types/highlight-deep-model.interface';

export interface IHighlightsRepository {
	findBy: (findData: Partial<HighlightModel>) => Promise<HighlightModel | null>;
	deepFindBy: (findData: Partial<HighlightModel>) => Promise<IHighlightDeepModel | null>;
	findManyBy: (findData: Partial<HighlightModel>) => Promise<HighlightModel[]>;
	deepFindManyBy: (findData: Partial<HighlightModel>) => Promise<IHighlightDeepModel[]>;
	deepFindManyIn: (
		findData: Partial<{ [K in keyof HighlightModel]: HighlightModel[K][] }>
	) => Promise<IHighlightDeepModel[]>;

	create: (highlight: Highlight) => Promise<IHighlightDeepModel>;
	update: (id: number, payload: Partial<Highlight>) => Promise<IHighlightDeepModel>;
	updateMany: (ids: number[], payload: Partial<Highlight>) => Promise<IBatchPayload>;
	individualUpdateMany: (data: IndividualUpdateHighlightsDto) => Promise<IHighlightDeepModel[]>;
	delete: (id: number) => Promise<HighlightModel>;
}
