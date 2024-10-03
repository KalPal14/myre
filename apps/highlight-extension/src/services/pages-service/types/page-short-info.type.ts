import { PageModel } from '~/highlight-extension/prisma/client';

export type TPageShortInfo = PageModel & {
	highlightsCount: number;
	notesCount: number;
};
