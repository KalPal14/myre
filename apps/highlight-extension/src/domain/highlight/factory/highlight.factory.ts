import { injectable } from 'inversify';

import { Highlight } from '../highlight';

import { IHighlightFactory, IHighlightFactoryCreateArgs } from './highlight-factory.interface';

@injectable()
export class HighlightFactory implements IHighlightFactory {
	create(highlightData: IHighlightFactoryCreateArgs): Highlight {
		const highlightOrder = this.setOrder(highlightData.order, highlightData.pageHighlightsCount);
		const highlight = new Highlight(
			highlightData.pageId,
			highlightOrder,
			highlightData.startContainerId,
			highlightData.endContainerId,
			highlightData.startOffset,
			highlightData.endOffset,
			highlightData.text,
			highlightData.color,
			highlightData.note
		);
		return highlight;
	}

	private setOrder(order?: number, pageHighlightsCount?: number): number {
		if (order) {
			return order;
		}
		if (pageHighlightsCount) {
			return pageHighlightsCount + 1;
		}
		return 1;
	}
}
