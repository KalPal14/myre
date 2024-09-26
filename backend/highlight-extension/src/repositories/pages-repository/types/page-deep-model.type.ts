import { HighlightModel, PageModel } from '@prisma/client';

export type TPageDeepModel = PageModel & {
	highlights?: HighlightModel[];
};
