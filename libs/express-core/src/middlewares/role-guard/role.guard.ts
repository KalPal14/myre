import { Request, Response, NextFunction } from 'express';

import { IJwtPayload, ROLE_GUARD_MSGS, TRole } from '~libs/common';

import { IMiddleware } from '../common/types/middleware.interface';

export class RoleGuard implements IMiddleware {
	private roles: TRole[];

	constructor(...roles: TRole[]) {
		this.roles = roles;
	}

	use({ user }: Request, res: Response, next: NextFunction): void {
		const isFitsRole = this.isFitsRole(user);
		if (isFitsRole) {
			return next();
		}
		res.status(403).send({
			err: ROLE_GUARD_MSGS[this.roles.join('_') ?? 'user'],
		});
	}

	private isFitsRole(user: IJwtPayload | undefined): boolean {
		const isFits = this.roles.map((role) => {
			switch (role) {
				case 'user':
					return !!user;
				case 'guest':
					return !user;
			}
		});
		return isFits.includes(true);
	}
}
