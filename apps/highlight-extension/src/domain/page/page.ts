export class Page {
	constructor(
		readonly userId: number,
		readonly url: string,
		readonly highlights: number[] = []
	) {}
}
