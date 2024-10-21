import { PageModel } from '~/highlight-extension/prisma/client';

export interface IPageShortInfo extends PageModel {
	highlightsCount: number;
	notesCount: number;
}
