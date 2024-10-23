import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';

// TODO
// export type TRoLimiter = Record<string, unknown> | null | undefined;
export type TRoLimiter = any;

type TFetch = <RO extends TRoLimiter, DTO>(url: string, data?: RO) => Promise<DTO | HTTPError>;

export default interface IApiServise {
	get: TFetch;
	post: TFetch;
	patch: TFetch;
	delete: TFetch;
}
