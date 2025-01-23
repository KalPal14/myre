import { inject, injectable } from 'inversify';

import { EXPRESS_CORE_TYPES } from '~libs/express-core/common/constants/types';
import { IJwtService } from '~libs/express-core/services/jwt-service/jwt.service.interface';

import { BaseJwtAuthMiddleware } from './base-jwt-auth.middleware';

@injectable()
export class JwtAuthMiddleware extends BaseJwtAuthMiddleware {
	constructor(@inject(EXPRESS_CORE_TYPES.JwtService) protected jwtService: IJwtService) {
		super();
	}
}
