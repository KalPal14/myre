import { PageModel } from '@prisma/client';

import { THighlightDeepModel } from '@/repositories/highlights-repository/types/highlight-deep-model.type';

export type TPageAllInfo = PageModel & {
	highlights: THighlightDeepModel[] | null;
};
