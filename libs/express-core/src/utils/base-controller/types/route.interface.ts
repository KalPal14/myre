import { Router } from 'express';

import { TController } from '~libs/express-core/types/controller.type';
import { IMiddleware } from '~libs/express-core/middlewares/common/types/middleware.interface';

export interface IRouteController {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'delete'>;
	func: TController<any, any, any>;
	middlewares?: IMiddleware[];
}
