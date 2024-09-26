import { HighlightModel } from '@prisma/client';

import { THighlightDeepModel } from './types/highlight-deep-model.type';

import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';
import { IHighlight } from '@/entities/highlight-entity/highlight.entity.interface';
import { IndividualUpdateHighlightsDto } from '@/dto/highlights/individual-update-highlights.dto';
import { IBatchPayload } from '@/common/types/batch-payload.interface';

export interface IHighlightsRepository {
	create: (highlight: IHighlight) => Promise<THighlightDeepModel>;
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
