import { JwtPayload, sign, verify, VerifyErrors } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';

import { IJwtPayload } from '~libs/common/index';
import { EXPRESS_CORE_TYPES } from '~libs/express-core/constants/types';

import { IConfigService } from '../config-service/config.service.interface';

import { IJwtService } from './jwt.service.interface';

@injectable()
export class JwtService implements IJwtService {
	constructor(@inject(EXPRESS_CORE_TYPES.ConfigService) private configService: IConfigService) {}

	generate(payload: IJwtPayload): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				payload,
				this.configService.get('JWT_KEY'),
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err.message);
					} else {
						resolve(token as string);
					}
				}
			);
		});
	}

	verify(jwt: string, onSuccess: (payload: IJwtPayload) => void, onFailure: () => void): void {
		verify(
			jwt,
			this.configService.get('JWT_KEY'),
			(err: VerifyErrors | null, payload: string | JwtPayload | undefined) => {
				if (err || !payload || typeof payload === 'string') {
					onFailure();
					return;
				}
				onSuccess(payload as IJwtPayload);
			}
		);
	}
}
