import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';
import { IBaseUserRo } from '~libs/ro/iam';

import IUpdatedHighlightExtState from './values/updated-highlight-ext-state.interface';
import IUpdatedPagesUrlsExtState from './values/updated-pages-urls-ext-state.interface';
import ICreateHighlightExtState from './values/created-highlight-ext-state.interface';
import IDeletedHighlightExtState from './values/deleted-highlight-ext-state.interface';

export interface ICrossExtStateDescriptor {
	jwt: string | null;
	currentUser: IBaseUserRo | null;
	currentWorkspace: IBaseWorkspaceRo | null;
	isExtActive: boolean;
	createdHighlight: ICreateHighlightExtState | null;
	deletedHighlight: IDeletedHighlightExtState | null;
	updatedHighlight: IUpdatedHighlightExtState | null;
	scrollHighlightId: `web-highlight-${number}` | null;
	unfoundHighlightsIds: number[];
	updatedPages: IUpdatedPagesUrlsExtState;
}
