import { CreateHighlightDto } from '~libs/dto/highlight-extension';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';
import { Node } from '~/highlight-extension/domain/node/node';
import { IHighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.interface';

import { START_NODE, END_NODE, START_NODE_MODEL, END_NODE_MODEL } from './nodes';
import { CREATE_PAGE_DTO, PAGE_MODEL } from './pages';
import { WORKSPACE_MODEL } from './workspaces';

export const HIGHLIGHT: Highlight = {
	pageId: PAGE_MODEL.id,
	order: 1,
	startOffset: 66,
	endOffset: 4,
	startContainerId: START_NODE_MODEL.id,
	endContainerId: END_NODE_MODEL.id,
	text: 'one-to-many relation between User and Post',
	color: '#ff1500',
	note: 'those modules between which the connection is established in the example',
};

export const HIGHLIGHT_DEEP: Highlight & { startContainer: Node; endContainer: Node } = {
	...HIGHLIGHT,
	startContainer: START_NODE,
	endContainer: END_NODE,
};

export const HIGHLIGHT_MODEL: HighlightModel = {
	id: 1,
	...HIGHLIGHT,
};

export const HIGHLIGHT_DEEP_MODEL: IHighlightDeepModel = {
	id: 1,
	...HIGHLIGHT_DEEP,
	startContainer: START_NODE_MODEL,
	endContainer: END_NODE_MODEL,
};

export const CREATE_HIGHLIGHT_DTO: CreateHighlightDto = {
	workspaceId: WORKSPACE_MODEL.id,
	pageUrl: CREATE_PAGE_DTO.url,
	startContainer: START_NODE,
	endContainer: END_NODE,
	startOffset: 2,
	endOffset: 2,
	text: 'new highlight text',
	color: '#ff1500',
};
