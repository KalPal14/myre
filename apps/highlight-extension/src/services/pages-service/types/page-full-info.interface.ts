import { PageModel } from '~/highlight-extension/prisma/client';
import { IHighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.interface';

export interface IPageFullInfo extends PageModel {
	highlights: IHighlightDeepModel[];
}
