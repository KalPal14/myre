import { inject, injectable } from 'inversify';
import { intersectionBy } from 'lodash';

import { IJwtPayload } from '~libs/express-core';
import {
	CreateHighlightDto,
	UpdateHighlightDto,
	IndividualUpdateHighlightsDto,
} from '~libs/dto/highlight-extension';

import { HighlightModel, PageModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { Highlight } from '~/highlight-extension/entities/highlight-entity/highlight.entity';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { THighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.type';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';

import { IPagesServise } from '../pages-service/pages.service.interface';
import { INodesService } from '../nodes-service/nodes.service.interface';

import { IHighlightsService } from './highlights.service.interface';

@injectable()
export class HighlightsService implements IHighlightsService {
	constructor(
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository,
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.PagesServise) private pagesServise: IPagesServise,
		@inject(TYPES.NodesService) private nodesService: INodesService
	) {}

	async getHighlights(ids: number[]): Promise<THighlightDeepModel[]> {
		return await this.highlightsRepository.findAllByIds(ids);
	}

	async createHighlight(
		createHighlightDto: CreateHighlightDto,
		user: IJwtPayload
	): Promise<THighlightDeepModel> {
		const { pageUrl, startContainer, endContainer, startOffset, endOffset, text, note, color } =
			createHighlightDto;

		let existingPage = await this.pagesRepository.findByUrl(pageUrl, user.id);
		if (!existingPage) {
			existingPage = (await this.pagesServise.createPage(
				createHighlightDto.pageUrl,
				user
			)) as PageModel;
		}
		const pageHighlights = await this.highlightsRepository.findAllByPageId(existingPage.id);

		const startNode = await this.nodesService.createNode(startContainer);
		const endNode = await this.nodesService.createNode(endContainer);

		const newHighlight = new Highlight(
			existingPage.id,
			startNode.id,
			endNode.id,
			startOffset,
			endOffset,
			text,
			color,
			{
				note,
				pageHighlightsCount: pageHighlights?.length,
			}
		).getData();

		return await this.highlightsRepository.create(newHighlight);
	}

	async updateHighlight(
		id: number,
		payload: UpdateHighlightDto
	): Promise<THighlightDeepModel | Error> {
		const existingHighlight = await this.highlightsRepository.findById(id);
		if (!existingHighlight) {
			return Error('There is no highlight with this ID');
		}

		const { startContainer, endContainer, ...rest } = payload;

		if (startContainer) {
			await this.nodesService.updateNode(existingHighlight.startContainerId, startContainer);
		}
		if (endContainer) {
			await this.nodesService.updateNode(existingHighlight.endContainerId, endContainer);
		}
		if (Object.keys(rest).length) {
			return await this.highlightsRepository.update(id, rest);
		}
		return existingHighlight;
	}

	async individualUpdateHighlights(
		data: IndividualUpdateHighlightsDto
	): Promise<THighlightDeepModel[]> {
		const ids = data.highlights.map(({ id }) => id);
		const existingHighlights = await this.highlightsRepository.findAllByIds(ids);
		const filteredHighlights = intersectionBy(data.highlights, existingHighlights, 'id');
		return await this.highlightsRepository.individualUpdateMany({
			highlights: filteredHighlights,
		});
	}

	async deleteHighlight(id: number): Promise<HighlightModel | Error> {
		const existingHighlight = await this.highlightsRepository.findById(id);
		if (!existingHighlight) {
			return Error('There is no highlight with this ID');
		}

		const highlight = await this.highlightsRepository.delete(id);
		await this.nodesService.deleteNode(existingHighlight.startContainerId);
		await this.nodesService.deleteNode(existingHighlight.endContainerId);
		return highlight;
	}
}
