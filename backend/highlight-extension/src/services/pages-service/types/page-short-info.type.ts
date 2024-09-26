import { PageModel } from '@prisma/client';

export type TPageShortInfo = PageModel & {
	highlightsCount: number;
	notesCount: number;
};
