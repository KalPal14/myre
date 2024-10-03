import { HighlightModel } from '~/highlight-extension/prisma/client';

import { RIGHT_PAGE, WRONG_PAGE } from './pages';
import { RIGHT_START_NODE, RIGHT_END_NODE, UPDATED_END_NODE } from './nodes';

export const RIGHT_HIGHLIGHT: HighlightModel = {
	id: 1,
	pageId: RIGHT_PAGE.id,
	order: 1,
	startOffset: 66,
	endOffset: 4,
	startContainerId: RIGHT_START_NODE.id,
	endContainerId: RIGHT_END_NODE.id,
	text: 'one-to-many relation between User and Post',
	color: '#ff1500',
	note: 'those modules between which the connection is established in the example',
};

export const UPDATED_HIGHLIGHT: HighlightModel = {
	id: 1,
	pageId: RIGHT_HIGHLIGHT.pageId,
	order: 2,
	startOffset: 66,
	endOffset: 5,
	startContainerId: RIGHT_START_NODE.id,
	endContainerId: UPDATED_END_NODE.id,
	text: 'one-to-many relation between User and Post because one user can have many blog posts.',
	note: 'new note',
	color: '#15ff00',
};

export const WRONG_HIGHLIGHT: Partial<HighlightModel> = {
	id: 500,
	pageId: WRONG_PAGE.id,
	text: 'wrong!!! wrong!!!',
};

export const INVALID_HIGHLIGHT: Partial<HighlightModel> = {
	color: 'green',
};
