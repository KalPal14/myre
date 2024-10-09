import { inject, injectable } from 'inversify';

import {
	HTTPError,
	RouteGuard,
	ValidateMiddleware,
	TController,
	BaseController,
} from '~libs/express-core';
import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';

import { PAGES_PATH } from '~/highlight-extension/common/constants/routes/pages';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IPagesServise } from '~/highlight-extension/services/pages-service/pages.service.interface';

import { IPagesController } from './pages.controller.interface';

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
