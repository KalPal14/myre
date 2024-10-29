import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';

type TFetch = <DTO, RO>(url: string, data?: DTO) => Promise<RO | HTTPError>;

export default interface IApiServise {
	get: TFetch;
	post: TFetch;
	patch: TFetch;
	delete: TFetch;
}
