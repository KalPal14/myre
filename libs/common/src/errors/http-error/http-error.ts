import { THttpErrorPayload } from './http-error-payload.type';

export class HTTPError extends Error {
	statusCode: number;
	payload: THttpErrorPayload;
	context: string | undefined;

	constructor(statusCode: number, payload: THttpErrorPayload | string, context?: string) {
		super(typeof payload === 'string' ? payload : JSON.stringify(payload));
		this.statusCode = statusCode;
		this.payload = typeof payload === 'string' ? { err: payload } : payload;
		this.context = context;
	}
}
