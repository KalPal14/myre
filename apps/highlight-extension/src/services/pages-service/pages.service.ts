import { inject, injectable } from 'inversify';

import { HTTPError } from '~libs/express-core';
import { UpdatePageDto } from '~libs/dto/highlight-extension';
import { CreatePageDto } from '~libs/dto/highlight-extension/pages/create-page.dto';

import { PageModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { IPageFactory } from '~/highlight-extension/domain/page/factory/page-factory.interface';
import { IPageDeepModel } from '~/highlight-extension/repositories/pages-repository/types/page-deep-model.interface';

import { IPageShortInfo } from './types/page-short-info.interface';
import { IPagesServise } from './pages.service.interface';
import { IPageFullInfo } from './types/page-full-info.interface';

@injectable()
export class PagesServise implements IPagesServise {
	constructor(
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.PageFactory) private pageFactory: IPageFactory,
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository
	) {}

	async getFullInfo(url: string, workspaceId: number): Promise<IPageFullInfo | null> {
		const page = await this.pagesRepository.findBy({ url, workspaceId });

		if (!page) {
			return null;
		}

		return {
			...page,
			highlights: await this.highlightsRepository.deepFindManyBy({ pageId: page.id }),
		};
	}

	async getPagesShortInfo(workspaceId: number): Promise<IPageShortInfo[]> {
		const pages = await this.pagesRepository.deepFindManyBy({ workspaceId });
		return pages.map(({ id, workspaceId, url, highlights = [] }) => {
			const highlightsWithNote = highlights.filter(({ note }) => note);
			return {
				id,
				workspaceId,
				url,
				highlightsCount: highlights.length,
				notesCount: highlightsWithNote.length,
			};
		});
	}

	async create({ url, workspaceId }: CreatePageDto): Promise<PageModel> {
		const existingPage = await this.pagesRepository.findBy({ url, workspaceId });
		if (existingPage) {
			throw new HTTPError(422, 'This page already exists');
		}

		const newPage = this.pageFactory.create({ workspaceId, url });
		return this.pagesRepository.create(newPage);
	}

	async update(pageId: number, { url, workspaceId }: UpdatePageDto): Promise<PageModel> {
		const currentPage = await this.pagesRepository.deepFindBy({ id: pageId });
		if (!currentPage) {
			throw new HTTPError(404, `page #${pageId} not found`);
		}
		if (currentPage.url === url) {
			throw new HTTPError(422, 'The new URL cannot be the same as the current one');
		}

		const pageToMerge = await this.pagesRepository.deepFindBy({ url, workspaceId });
		if (pageToMerge) {
			await this.mergePages(currentPage, pageToMerge);
		}

		return this.pagesRepository.update(pageId, { url });
	}

	private async mergePages(
		currentPage: IPageDeepModel,
		pageToMerge: IPageDeepModel
	): Promise<void> {
		const highlightsToMerge = pageToMerge.highlights;
		const highlightToMergeMaxOrder = highlightsToMerge
			? highlightsToMerge[highlightsToMerge.length - 1].order
			: 0;
		const individualUpdateCurrentHighligtsData =
			currentPage.highlights.map(({ id, order }) => ({
				id,
				payload: { order: order + highlightToMergeMaxOrder },
			})) ?? [];
		await this.highlightsRepository.individualUpdateMany({
			highlights: individualUpdateCurrentHighligtsData,
		});

		const mergeHighlightsIds = pageToMerge.highlights?.map(({ id }) => id) ?? [];
		await this.highlightsRepository.updateMany(mergeHighlightsIds, { pageId: currentPage.id });
		await this.pagesRepository.delete(pageToMerge.id);
	}
}
