export interface IWebExtEvent<TCallback extends (...args: any[]) => any> {
	addListener(cb: TCallback): void;
	removeListener(cb: TCallback): void;
	hasListener(cb: TCallback): boolean;
}
