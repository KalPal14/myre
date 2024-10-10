export class Highlight {
	constructor(
		readonly pageId: number,
		readonly order: number,
		readonly startContainerId: number,
		readonly endContainerId: number,
		readonly startOffset: number,
		readonly endOffset: number,
		readonly text: string,
		readonly color: string,
		readonly note: string | null = null
	) {}
}
