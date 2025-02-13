export interface IBrowserStorage {
	get: (key: string) => Promise<Record<string, any>>;
	set: (state: Record<string, any>) => Promise<void>;
	onChanged: {
		addListener: (callback: (key: string, newValue: any) => void) => void;
		removeListener: (callback: (key: string, newValue: any) => void) => void;
	};
}
