import { INodeRo } from './node.ro';

export interface IBaseHighlightRo {
	id: number;
	pageId: number;
	order: number;
	startContainerId: number;
	endContainerId: number;
	startOffset: number;
	endOffset: number;
	text: string;
	color: string;
	note: string | null;
	startContainer: INodeRo;
	endContainer: INodeRo;
}
