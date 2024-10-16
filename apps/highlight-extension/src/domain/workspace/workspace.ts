export class Workspace {
	constructor(
		readonly ownerId: number,
		readonly name: string,
		readonly colors: string[] = []
	) {}
}
