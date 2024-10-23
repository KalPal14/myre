import { IBaseHighlightRo } from '../../highlights/common/base-highlight.ro';

export interface IBasePageRo {
	id: number;
	workspaceId: number;
	url: string;
	highlights: IBaseHighlightRo[];
}
