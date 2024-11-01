import { HTTPError } from '~libs/common';

type TFetchRequest = <DTO, RO>(url: string, data?: DTO) => Promise<RO | HTTPError>;

export interface IBaseApiService {
	get: TFetchRequest;
	post: TFetchRequest;
	patch: TFetchRequest;
	delete: TFetchRequest;
}
