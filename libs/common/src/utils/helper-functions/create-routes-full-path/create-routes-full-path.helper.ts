export function createRoutesFullPath<T extends Record<string, string>>(
	rootRoute: string,
	routes: T
): T {
	let fullPathRoutes = {};
	for (const key in routes) {
		fullPathRoutes = { ...fullPathRoutes, [key]: rootRoute + routes[key] };
	}
	return fullPathRoutes as T;
}
