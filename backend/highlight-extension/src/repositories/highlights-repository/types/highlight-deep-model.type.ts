import { HighlightModel, NodeModel } from '@prisma/client';

export type THighlightDeepModel = HighlightModel & {
	startContainer: NodeModel | null;
	endContainer: NodeModel | null;
};
