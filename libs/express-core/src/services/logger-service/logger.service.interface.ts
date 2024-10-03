export interface ILogger {
	log: (...args: unknown[]) => void;
	err: (...args: unknown[]) => void;
}
