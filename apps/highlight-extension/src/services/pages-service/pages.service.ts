import { inject, injectable } from 'inversify';

import { HTTPError } from '~libs/express-core';
import { UpdatePageDto } from '~libs/dto/highlight-extension';

import { PageModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { IPageFactory } from '~/highlight-extension/domain/page/factory/page-factory.interface';

import { TPageShortInfo } from './types/page-short-info.type';
import { TPageAllInfo } from './types/page-all-info.type';
import { IPagesServise } from './pages.service.interface';

@injectable()
export class PagesServise implements IPagesServise {
	constructor(
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.PageFactory) private pageFactory: IPageFactory,
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository
	) {}

	async createPage(pageUrl: string, workspaceId: number): Promise<PageModel | Error> {
		const existingPage = await this.pagesRepository.findByUrl(pageUrl, workspaceId);
		if (existingPage) {
			throw new HTTPError(422, 'This page already exists');
		}

		const newPage = this.pageFactory.create({ workspaceId, url: pageUrl });
		return await this.pagesRepository.create(newPage);
	}

	async updatePage(
		userId: number,
		pageId: number,
		{ url }: UpdatePageDto
	): Promise<PageModel | Error> {
		const currentPage = await this.pagesRepository.findById(pageId);
		if (!currentPage) {
			return Error('This page does not exist');
		}
		if (currentPage.url === url) {
			return Error('The new URL cannot be the same as the current one');
		}

		const pageToMerge = await this.pagesRepository.findByUrl(url, userId, true);
		if (pageToMerge) {
			const pageToMergeHighlightsMaxOrder = pageToMerge.highlights
				? pageToMerge.highlights[pageToMerge.highlights.length - 1].order
				: 0;
			const currentPageHighlights = (await this.highlightsRepository.findAllByPageId(pageId)) ?? [];
			const individualUpdateCurrentHighligtsData =
				currentPageHighlights.map(({ id, order }) => ({
					id,
					payload: { order: order + pageToMergeHighlightsMaxOrder },
				})) ?? [];
			await this.highlightsRepository.individualUpdateMany({
				highlights: individualUpdateCurrentHighligtsData,
			});

			const mergeHighlightsIds = pageToMerge.highlights?.map(({ id }) => id) ?? [];
			await this.highlightsRepository.updateMany(mergeHighlightsIds, { pageId });
			await this.pagesRepository.delete(pageToMerge.id);
		}

		return await this.pagesRepository.update(pageId, { url });
	}

	async getPageInfo(url: string, userId: number): Promise<TPageAllInfo | null> {
		const page = await this.pagesRepository.findByUrl(url, userId, false);

		if (!page) {
			return null;
		}

		return {
			...page,
			highlights: await this.highlightsRepository.findAllByPageId(page.id),
		};
	}

	async getPagesInfo(userId: number): Promise<TPageShortInfo[]> {
		const pages = await this.pagesRepository.findAll(userId, true);
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
}
