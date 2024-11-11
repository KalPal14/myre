import { IJwtPayload } from '~libs/common/index';

export interface IJwtService {
	generate: (payload: IJwtPayload) => Promise<string | Error>;
	verify: (jwt: string, onSuccess: (payload: IJwtPayload) => void, onFailure: () => void) => void;
}
