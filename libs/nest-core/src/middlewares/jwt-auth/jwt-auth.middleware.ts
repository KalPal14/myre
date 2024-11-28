import { Injectable } from '@nestjs/common';

import { BaseJwtAuthMiddleware } from '~libs/express-core';

import { JwtService } from '../../services/jwt-service/jwt.service';

@Injectable()
export class JwtAuthMiddleware extends BaseJwtAuthMiddleware {
	constructor(protected readonly jwtService: JwtService) {
		super();
	}
}
