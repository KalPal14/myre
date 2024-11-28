import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { IJwtPayload, TRole } from '~libs/common';

import { ROLES_KEY } from '../../decorators/roles/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<TRole[]>(ROLES_KEY, context.getHandler()) ?? ['user'];
		const { user } = context.switchToHttp().getRequest<Request>();
		const isFitsRole = this.isFitsRole(user, roles);
		if (!isFitsRole) return false;
		return true;
	}

	private isFitsRole(user: IJwtPayload | undefined, roles: TRole[]): boolean {
		const isFits = roles.map((role) => {
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
