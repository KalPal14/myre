import { inject, injectable } from 'inversify';
import { intersectionBy } from 'lodash';

import {
	CreateHighlightDto,
	UpdateHighlightDto,
	IndividualUpdateHighlightsDto,
} from '~libs/dto/highlight-extension';
import { HTTPError } from '~libs/express-core';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IHighlightDeepModel } from '~/highlight-extension/repositories/highlights-repository/types/highlight-deep-model.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { IHighlightFactory } from '~/highlight-extension/domain/highlight/factory/highlight-factory.interface';

import { IPagesServise } from '../pages-service/pages.service.interface';
import { INodesService } from '../nodes-service/nodes.service.interface';

import { IHighlightsService } from './highlights.service.interface';

@injectable()
export class HighlightsService implements IHighlightsService {
	constructor(
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository,
		@inject(TYPES.HighlightFactory) private highlightFactory: IHighlightFactory,
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.PagesServise) private pagesServise: IPagesServise,
		@inject(TYPES.NodesService) private nodesService: INodesService
	) {}

	async get(id: number): Promise<IHighlightDeepModel> {
		const highlight = await this.highlightsRepository.deepFindBy({ id });
		if (!highlight) {
			throw new HTTPError(404, `highlight #${id} not found`);
		}

		return highlight;
	}

	getMany(ids: number[]): Promise<IHighlightDeepModel[]> {
		return this.highlightsRepository.deepFindManyIn({ id: ids });
	}

	async create(createHighlightDto: CreateHighlightDto): Promise<IHighlightDeepModel> {
		const { pageUrl, startContainer, endContainer, workspaceId } = createHighlightDto;

		let page = await this.pagesRepository.findBy({ url: pageUrl, workspaceId });
		if (!page) {
			page = await this.pagesServise.create({ url: pageUrl, workspaceId });
		}

		const pageHighlights = await this.highlightsRepository.findManyBy({ id: page.id });

		const startNode = await this.nodesService.create(startContainer);
		const endNode = await this.nodesService.create(endContainer);

		const newHighlight = this.highlightFactory.create({
			...createHighlightDto,
			pageId: page.id,
			startContainerId: startNode.id,
			endContainerId: endNode.id,
			pageHighlightsCount: pageHighlights.length,
		});
		return this.highlightsRepository.create(newHighlight);
	}

	async update(id: number, payload: UpdateHighlightDto): Promise<IHighlightDeepModel> {
		const existingHighlight = await this.get(id);
		const { startContainer, endContainer, ...restPayload } = payload;

		if (startContainer) {
			await this.nodesService.update(existingHighlight.startContainerId, startContainer);
		}
		if (endContainer) {
			await this.nodesService.update(existingHighlight.endContainerId, endContainer);
		}

		return this.highlightsRepository.update(id, restPayload);
	}

	async individualUpdateMany(data: IndividualUpdateHighlightsDto): Promise<IHighlightDeepModel[]> {
		const ids = data.highlights.map(({ id }) => id);
		const existingHighlights = await this.highlightsRepository.deepFindManyIn({ id: ids });
		const filteredHighlights = intersectionBy(data.highlights, existingHighlights, 'id');
		return this.highlightsRepository.individualUpdateMany({
			highlights: filteredHighlights,
		});
	}

	async delete(id: number): Promise<IHighlightDeepModel> {
		const existingHighlight = await this.get(id);

		const highlight = await this.highlightsRepository.delete(id);
		const startContainer = await this.nodesService.delete(existingHighlight.startContainerId);
		const endContainer = await this.nodesService.delete(existingHighlight.endContainerId);
		return { ...highlight, startContainer, endContainer };
	}
}
