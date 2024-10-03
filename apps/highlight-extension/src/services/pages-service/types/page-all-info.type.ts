import { PageModel } from '~/highlight-extension/prisma/client';
import { THighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.type';

export type TPageAllInfo = PageModel & {
	highlights: THighlightDeepModel[] | null;
};
