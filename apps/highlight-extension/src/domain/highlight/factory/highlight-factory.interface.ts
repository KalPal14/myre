import { Highlight } from '../highlight';

export interface IHighlightFactoryCreateArgs extends Omit<Highlight, 'order' | 'note'> {
	pageHighlightsCount?: number;
	order?: number;
	note?: string | null;
}

export interface IHighlightFactory {
	create: (highlightData: IHighlightFactoryCreateArgs) => Highlight;
}
