import { HighlightModel, NodeModel } from '~/highlight-extension/prisma/client';

export interface IHighlightDeepModel extends HighlightModel {
	startContainer: NodeModel;
	endContainer: NodeModel;
}
