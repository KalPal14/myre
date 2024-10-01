import { PageModel } from '@orm/client';

export type TPageShortInfo = PageModel & {
	highlightsCount: number;
	notesCount: number;
};
