import { HighlightModel, NodeModel } from '@orm/client';

export type THighlightDeepModel = HighlightModel & {
	startContainer: NodeModel | null;
	endContainer: NodeModel | null;
};
