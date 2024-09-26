import { inject, injectable } from 'inversify';

import { BaseController } from '../base-controller/base.controller';
import { TController } from '../common/types/controller.type';

import { IPagesController } from './pages.controller.interface';

import { PAGES_PATH } from '@/common/constants/routes/pages';
import TYPES from '@/common/constants/types.inversify';
import { GetPageDto } from '@/dto/pages/get-page.dto';
import { RouteGuard } from '@/middlewares/route-guard/route.guard';
import { ValidateMiddleware } from '@/middlewares/validate.middleware';
import { IPagesServise } from '@/services/pages-service/pages.service.interface';
import { UpdatePageDto } from '@/dto/pages/update-page.dto';
import { HTTPError } from '@/exceptions/http-error.class';

@injectable()
export class PagesController extends BaseController implements IPagesController {
	constructor(@inject(TYPES.PagesServise) private pagesServise: IPagesServise) {
		super();
		this.bindRoutes([
			{
				path: PAGES_PATH.getPage,
				method: 'get',
				func: this.getPage,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(GetPageDto, 'query')],
			},
			{
				path: PAGES_PATH.getPages,
				method: 'get',
				func: this.getPages,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: PAGES_PATH.updatePage,
				method: 'patch',
				func: this.updatePage,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdatePageDto)],
			},
		]);
	}

	getPage: TController<null, null, GetPageDto> = async ({ user, query }, res) => {
		const result = await this.pagesServise.getPageInfo(query.url, user.id);

		if (!result) {
			this.ok(res, { id: null });
			return;
		}

		this.ok(res, result);
	};

	getPages: TController = async ({ user }, res) => {
		const result = await this.pagesServise.getPagesInfo(user.id);

		this.ok(res, result);
	};

	updatePage: TController<{ id: string }, UpdatePageDto> = async (
		{ user, params, body },
		res,
		next
	) => {
		const result = await this.pagesServise.updatePage(user.id, Number(params.id), body);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.ok(res, result);
	};
}
