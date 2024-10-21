import { inject, injectable } from 'inversify';

import { RouteGuard, ValidateMiddleware, TController, BaseController } from '~libs/express-core';
import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';

import { PAGES_ENDPOINTS } from '~/highlight-extension/common/constants/routes/pages';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IPagesServise } from '~/highlight-extension/services/pages-service/pages.service.interface';

import { IPagesController } from './pages.controller.interface';

@injectable()
export class PagesController extends BaseController implements IPagesController {
	constructor(@inject(TYPES.PagesServise) private pagesServise: IPagesServise) {
		super();
		this.bindRoutes([
			{
				path: PAGES_ENDPOINTS.get,
				method: 'get',
				func: this.getFullInfo,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(GetPageDto, 'query')],
			},
			{
				path: PAGES_ENDPOINTS.getPagesShortInfo,
				method: 'get',
				func: this.getPagesShortInfo,
				middlewares: [new RouteGuard('user')],
			},
			{
				path: PAGES_ENDPOINTS.update,
				method: 'patch',
				func: this.update,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdatePageDto)],
			},
		]);
	}

	getFullInfo: TController<null, null, GetPageDto> = async ({ user, query }, res) => {
		const result = await this.pagesServise.getFullInfo(query.url, user.id);

		if (!result) {
			this.ok(res, { id: null });
			return;
		}

		this.ok(res, result);
	};

	getPagesShortInfo: TController = async ({ user }, res) => {
		const result = await this.pagesServise.getPagesShortInfo(user.id);
		this.ok(res, result);
	};

	update: TController<{ id: string }, UpdatePageDto> = async ({ params, body }, res) => {
		const result = await this.pagesServise.update(+params.id, body);
		this.ok(res, result);
	};
}
