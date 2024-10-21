import { HighlightModel, PageModel } from '~/highlight-extension/prisma/client';

export interface IPageDeepModel extends PageModel {
	highlights: HighlightModel[];
}
