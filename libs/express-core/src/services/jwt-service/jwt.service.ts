import { inject, injectable } from 'inversify';

import { EXPRESS_CORE_TYPES } from '~libs/express-core/common/constants/types';

import { IConfigService } from '../config-service/config.service.interface';

import { BaseJwtService } from './base-jwt.service';

@injectable()
export class JwtService extends BaseJwtService {
	constructor(@inject(EXPRESS_CORE_TYPES.ConfigService) protected configService: IConfigService) {
		super();
	}
}
