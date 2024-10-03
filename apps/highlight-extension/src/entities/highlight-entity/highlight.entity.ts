import { IHighlight } from './highlight.entity.interface';
import { IHighlightEntityOptionalArgs } from './types/highlight-entity-connstructor.interface';

export class Highlight implements IHighlight {
	private _note?: string;
	private _order: number;

	constructor(
		private _pageId: number,
		private _startContainerId: number,
		private _endContainerId: number,
		private _startOffset: number,
		private _endOffset: number,
		private _text: string,
		private _color: string,
		{ note, order, pageHighlightsCount }: IHighlightEntityOptionalArgs
	) {
		this._note = note;
		this.setOrder(order, pageHighlightsCount);
	}

	private setOrder(order?: number, pageHighlightsCount?: number | null): void {
		if (order) {
			this._order = order;
			return;
		}
		if (!pageHighlightsCount) {
			this._order = 1;
			return;
		}
		this._order = pageHighlightsCount + 1;
	}

	get pageId(): number {
		return this._pageId;
	}
	get order(): number {
		return this._order;
	}
	get startContainerId(): number {
		return this._startContainerId;
	}
	get endContainerId(): number {
		return this._endContainerId;
	}
	get startOffset(): number {
		return this._startOffset;
	}
	get endOffset(): number {
		return this._endOffset;
	}
	get text(): string {
		return this._text;
	}
	get color(): string {
		return this._color;
	}
	get note(): string | null {
		return this._note || null;
	}

	getData(): IHighlight {
		return {
			pageId: this.pageId,
			order: this.order,
			startContainerId: this.startContainerId,
			endContainerId: this.endContainerId,
			startOffset: this.startOffset,
			endOffset: this.endOffset,
			text: this.text,
			color: this.color,
			note: this.note,
		};
	}
}
