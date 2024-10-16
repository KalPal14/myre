export class Page {
	constructor(
		readonly workspaceId: number,
		readonly url: string,
		readonly highlights: number[] = []
	) {}
}
