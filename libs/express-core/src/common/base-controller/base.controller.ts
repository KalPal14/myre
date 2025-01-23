import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { TController } from '~libs/express-core/common/types/controller.type';
import { RoleGuard } from '~libs/express-core/middlewares/role-guard/role.guard';
import { IMiddleware } from '~libs/express-core/middlewares/common/types/middleware.interface';

import { IRouteController } from './types/route.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor() {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected send<T>(res: Response, code: number, msg: T): Response<T> {
		res.contentType('application/json');
		return res.status(code).send(msg);
	}

	protected ok<T>(res: Response, msg: T): Response<T> {
		return this.send(res, 200, msg);
	}

	protected created<T>(res: Response, msg: T): Response<T> {
		return this.send(res, 201, msg);
	}

	protected bindRoutes(routes: IRouteController[]): void {
		routes.forEach((route) => {
			const middlewares = this.buildMiddleweres(route.middlewares);
			const middlewareHandlers = middlewares.map((m) => m.use.bind(m));
			const handler: TController = async (req, res, next) => {
				try {
					await route.func.bind(this)(req, res, next);
				} catch (err) {
					next(err);
				}
			};
			const pipeline = [...middlewareHandlers, handler];
			this._router[route.method](route.path, pipeline);
		});
	}

	private buildMiddleweres(passedMiddleware?: IMiddleware[]): IMiddleware[] {
		if (!passedMiddleware) {
			return [new RoleGuard('user')];
		}

		const isHaveRouteGuard = passedMiddleware.map((m) => m instanceof RoleGuard).includes(true);
		if (!isHaveRouteGuard) {
			return [new RoleGuard('user'), ...passedMiddleware];
		}
		return passedMiddleware;
	}
}
