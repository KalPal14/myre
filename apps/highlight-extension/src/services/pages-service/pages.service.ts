import { inject, injectable } from 'inversify';
import { PageModel } from '~/highlight-extension/prisma/client';

import { IJwtPayload } from '~libs/express-core';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { Page } from '~/highlight-extension/entities/page-entity/page.entity';
import { IHighlightsRepository } from '~/highlight-extension/repositories/highlights-repository/highlights.repository.interface';
import { IPagesRepository } from '~/highlight-extension/repositories/pages-repository/pages.repository.interface';
import { UpdatePageDto } from '~/highlight-extension/dto/pages/update-page.dto';

import { TPageShortInfo } from './types/page-short-info.type';
import { TPageAllInfo } from './types/page-all-info.type';
import { IPagesServise } from './pages.service.interface';

@injectable()
export class PagesServise implements IPagesServise {
	constructor(
		@inject(TYPES.PagesRepository) private pagesRepository: IPagesRepository,
		@inject(TYPES.HighlightsRepository) private highlightsRepository: IHighlightsRepository
	) {}

	async createPage(pageUrl: string, { id }: IJwtPayload): Promise<PageModel | Error> {
		const existingPage = await this.pagesRepository.findByUrl(pageUrl, id);
		if (existingPage) {
			return Error('This page already exists');
		}

		const newPage = new Page(id, pageUrl).getData();
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
		return pages.map(({ id, userId, url, highlights = [] }) => {
			const highlightsWithNote = highlights.filter(({ note }) => note);
			return {
				id,
				userId,
				url,
				highlightsCount: highlights.length,
				notesCount: highlightsWithNote.length,
			};
		});
	}
}
