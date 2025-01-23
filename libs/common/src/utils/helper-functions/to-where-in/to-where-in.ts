export function toWhereIn(obj: object): {
	[k: string]: {
		in: any[];
	};
} {
	return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, { in: value }]));
}
