import { HighlightModel, NodeModel } from '~/highlight-extension/prisma/client';

export type THighlightDeepModel = HighlightModel & {
	startContainer: NodeModel | null;
	endContainer: NodeModel | null;
};
