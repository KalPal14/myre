import { inject, injectable } from 'inversify';

import { PageModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';
import { Page } from '~/highlight-extension/domain/page/page';

import { IPagesRepository } from './pages.repository.interface';
import { IPageDeepModel } from './types/page-deep-model.interface';

@injectable()
export class PagesRepository implements IPagesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	findBy(findData: Partial<PageModel>): Promise<PageModel | null> {
		return this.prismaService.client.pageModel.findFirst({
			where: findData,
		});
	}

	deepFindBy(findData: Partial<PageModel>): Promise<IPageDeepModel | null> {
		return this.prismaService.client.pageModel.findFirst({
			where: findData,
			include: { highlights: true },
		});
	}

	findManyBy(findData: Partial<PageModel>): Promise<PageModel[]> {
		return this.prismaService.client.pageModel.findMany({
			where: findData,
		});
	}

	deepFindManyBy(findData: Partial<PageModel>): Promise<IPageDeepModel[]> {
		return this.prismaService.client.pageModel.findMany({
			where: findData,
			include: { highlights: true },
		});
	}

	create({ workspaceId, url }: Page): Promise<PageModel> {
		return this.prismaService.client.pageModel.create({
			data: {
				workspaceId,
				url,
			},
		});
	}

	async update(id: number, payload: Partial<Page>): Promise<PageModel> {
		return this.prismaService.client.pageModel.update({
			where: { id },
			data: payload,
		});
	}

	async delete(id: number): Promise<PageModel> {
		return this.prismaService.client.pageModel.delete({
			where: { id },
		});
	}
}
