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

import { HIGHLIGHTS_PATH } from '~/highlight-extension/common/constants/routes/highlights';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsService } from '~/highlight-extension/services/highlights-service/highlights.service.interface';

import { IHighlightsController } from './highlights.controller.interface';

@injectable()
export class HighlightsController extends BaseController implements IHighlightsController {
	constructor(@inject(TYPES.HighlightsService) private highlightsService: IHighlightsService) {
		super();
		this.bindRoutes([
			{
				path: HIGHLIGHTS_PATH.get,
				method: 'get',
				func: this.getHighlights,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(GetHighlightsDto, 'query')],
			},
			{
				path: HIGHLIGHTS_PATH.create,
				method: 'post',
				func: this.createHighlight,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(CreateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_PATH.update,
				method: 'patch',
				func: this.updateHighlight,
				middlewares: [new RouteGuard('user'), new ValidateMiddleware(UpdateHighlightDto)],
			},
			{
				path: HIGHLIGHTS_PATH.individualUpdateMany,
				method: 'patch',
				func: this.individualUpdateHighlights,
				middlewares: [
					new RouteGuard('user'),
					new ValidateMiddleware(IndividualUpdateHighlightsDto),
				],
			},
			{
				path: HIGHLIGHTS_PATH.delete,
				method: 'delete',
				func: this.deleteHighlight,
				middlewares: [new RouteGuard('user')],
			},
		]);
	}

	getHighlights: TController<null, null, GetHighlightsDto> = async ({ query }, res) => {
		const result = await this.highlightsService.getHighlights(JSON.parse(query.ids));

		this.ok(res, result);
	};

	createHighlight: TController<null, CreateHighlightDto> = async ({ body, user }, res, next) => {
		const result = await this.highlightsService.createHighlight(body, user);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.created(res, result);
	};

	updateHighlight: TController<{ id: string }, UpdateHighlightDto> = async (
		{ params, body },
		res,
		next
	) => {
		if (!Object.keys(body).length) {
			return next(new HTTPError(422, 'Highlight change data is empty'));
		}

		const result = await this.highlightsService.updateHighlight(Number(params.id), body);

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.ok(res, result);
	};

	individualUpdateHighlights: TController<null, IndividualUpdateHighlightsDto> = async (
		{ body },
		res
	) => {
		const result = await this.highlightsService.individualUpdateHighlights(body);

		this.ok(res, result);
	};

	deleteHighlight: TController<{ id: string }> = async ({ params }, res, next) => {
		const result = await this.highlightsService.deleteHighlight(Number(params.id));

		if (result instanceof Error) {
			return next(new HTTPError(422, result.message));
		}

		this.ok(res, result);
	};
}
