import { HighlightModel, PageModel } from '~/highlight-extension/prisma/client';

export type TPageDeepModel = PageModel & {
	highlights?: HighlightModel[];
};
