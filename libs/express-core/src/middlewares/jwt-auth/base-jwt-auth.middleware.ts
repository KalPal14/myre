import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

import { IJwtService, IMiddleware } from '~libs/express-core';

@injectable()
export abstract class BaseJwtAuthMiddleware implements IMiddleware {
	protected abstract jwtService: IJwtService;

	use(req: Request, res: Response, next: NextFunction): void {
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
