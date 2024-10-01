import { inject, injectable } from 'inversify';
import { PageModel } from '@orm/client';

import { IPagesRepository } from './pages.repository.interface';
import { TPageDeepModel } from './types/page-deep-model.type';

import TYPES from '@/common/constants/types.inversify';
import { IPage } from '@/entities/page-entity/page.entity.interface';
import { IPrismaService } from '@/utils/services/prisma-service/prisma.service.interface';

@injectable()
export class PagesRepository implements IPagesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create({ userId, url }: IPage): Promise<PageModel> {
		return await this.prismaService.client.pageModel.create({
			data: {
				userId,
				url,
			},
		});
	}

	async update(id: number, { url }: Pick<IPage, 'url'>): Promise<PageModel> {
		return await this.prismaService.client.pageModel.update({
			where: { id },
			data: {
				url,
			},
		});
	}

	async findByUrl(
		url: string,
		userId: number,
		includeHighlights: boolean = false
	): Promise<TPageDeepModel | null> {
		return await this.prismaService.client.pageModel.findFirst({
			where: {
				userId,
				url,
			},
			include: {
				highlights: includeHighlights,
			},
		});
	}

	async findById(id: number): Promise<PageModel | null> {
		return await this.prismaService.client.pageModel.findFirst({
			where: {
				id,
			},
		});
	}

	async findAll(userId: number, includeHighlights: boolean = false): Promise<TPageDeepModel[]> {
		return await this.prismaService.client.pageModel.findMany({
			where: {
				userId,
			},
			orderBy: { id: 'asc' },
			include: {
				highlights: includeHighlights,
			},
		});
	}

	async delete(id: number): Promise<PageModel> {
		return await this.prismaService.client.pageModel.delete({
			where: { id },
		});
	}
}
