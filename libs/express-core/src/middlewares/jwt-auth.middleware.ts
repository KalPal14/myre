import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { EXPRESS_CORE_TYPES } from '../constants/types';
import { IJwtService } from '../services/jwt-service/jwt.service.interface';

import { IMiddleware } from './common/types/middleware.interface';

@injectable()
export class JwtAuthMiddleware implements IMiddleware {
	constructor(@inject(EXPRESS_CORE_TYPES.JwtService) private jwtService: IJwtService) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.headers.authorization) return next();
		const jwt = req.headers.authorization.split(' ')[1];
		if (!jwt) return next();
		this.jwtService.verify(
			jwt,
			(payload) => {
				req.user = payload;
				next();
			},
			() => next()
		);
	}
}
