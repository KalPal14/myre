import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { IMiddleware } from '../common/types/middleware.interface';

import { TRole } from './types/user.role.type';

export class RouteGuard implements IMiddleware {
	private errMsg: string;

	constructor(private role: TRole) {
		switch (role) {
			case 'user':
				this.errMsg = 'User is not authorized';
				break;
			case 'guest':
				this.errMsg = 'You are already logged in';
				break;
		}
	}

	execute(req: Request, res: Response, next: NextFunction): void {
		const isFitsRole = this.isFitsRole(req.user);
		if (isFitsRole) {
			return next();
		}
		res.status(401).send({
			err: this.errMsg,
		});
	}

	private isFitsRole(reqUser: JwtPayload): boolean {
		switch (this.role) {
			case 'user':
				return this.isUser(reqUser);
			case 'guest':
				return this.isGuest(reqUser);
		}
	}

	private isUser(reqUser: JwtPayload): boolean {
		return !!reqUser;
	}

	private isGuest(reqUser: JwtPayload): boolean {
		return !reqUser;
	}
}
