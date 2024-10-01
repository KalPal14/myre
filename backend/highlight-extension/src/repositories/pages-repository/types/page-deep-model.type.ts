import { HighlightModel, PageModel } from '@orm/client';

export type TPageDeepModel = PageModel & {
	highlights?: HighlightModel[];
};
