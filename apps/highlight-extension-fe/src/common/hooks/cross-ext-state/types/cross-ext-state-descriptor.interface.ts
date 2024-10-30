import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';
import { IBaseUserRo } from '~libs/ro/iam';

import IDeletedHighlightExtState from '../../../types/cross-ext-state/deleted-highlight-ext-state.interface';
import IUpdatedHighlightExtState from '../../../types/cross-ext-state/updated-highlight-ext-state.interface';
import IUpdatedPagesUrlsExtState from '../../../types/cross-ext-state/updated-pages-urls-ext-state.interface';
import ICreateHighlightExtState from '../../../types/cross-ext-state/created-highlight-ext-state.interface';

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
