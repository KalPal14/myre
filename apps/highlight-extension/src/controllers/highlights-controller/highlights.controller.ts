import { inject, injectable } from 'inversify';

import {
	HTTPError,
	RouteGuard,
	ValidateMiddleware,
	TController,
	BaseController,
} from '~libs/express-core';
import {
	GetHighlightsDto,
	CreateHighlightDto,
	UpdateHighlightDto,
	IndividualUpdateHighlightsDto,
} from '~libs/dto/highlight-extension';
import { HIGHLIGHTS_ENDPOINTS } from '~libs/routes/highlight-extension';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsService } from '~/highlight-extension/services/highlights-service/highlights.service.interface';

import { IHighlightsController } from './highlights.controller.interface';

@injectable()
export class HighlightsController extends BaseController implements IHighlightsController {
	constructor(@inject(TYPES.HighlightsService) private highlightsService: IHighlightsService) {
		super();
		this.bindRoutes([
			{
				path: HIGHLIGHTS_ENDPOINTS.getMany,
				method: 'get',
				func: this.getMany,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(GetHighlightsDto, 'query')],
			},
			{
				path: HIGHLIGHTS_ENDPOINTS.create,
				method: 'post',
				func: this.create,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(CreateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_ENDPOINTS.update,
				method: 'patch',
				func: this.update,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_ENDPOINTS.individualUpdateMany,
				method: 'patch',
				func: this.individualUpdateMany,
				middlewares: [
					new RouteGuard('user'),
					new ValidateMiddleware(IndividualUpdateHighlightsDto),
				],
			},
			{
				path: HIGHLIGHTS_ENDPOINTS.delete,
				method: 'delete',
				func: this.delete,
				middlewares: [new RouteGuard('user')],
			},
		]);
	}

	getMany: TController<null, null, GetHighlightsDto> = async ({ query }, res) => {
		const result = await this.highlightsService.getMany(JSON.parse(query.ids));
		this.ok(res, result);
	};

	create: TController<null, CreateHighlightDto> = async ({ body }, res) => {
		const result = await this.highlightsService.create(body);
		this.created(res, result);
	};

	update: TController<{ id: string }, UpdateHighlightDto> = async ({ params, body }, res, next) => {
		if (!Object.keys(body).length) {
			return next(new HTTPError(422, 'Highlight change data is empty'));
		}

		const result = await this.highlightsService.update(+params.id, body);
		this.ok(res, result);
	};

	individualUpdateMany: TController<null, IndividualUpdateHighlightsDto> = async (
		{ body },
		res
	) => {
		const result = await this.highlightsService.individualUpdateMany(body);
		this.ok(res, result);
	};

	delete: TController<{ id: string }> = async ({ params }, res, next) => {
		const result = await this.highlightsService.delete(+params.id);
		this.ok(res, result);
	};
}
