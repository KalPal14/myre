import { inject, injectable } from 'inversify';

import { UpdateHighlightDto, IndividualUpdateHighlightsDto } from '~libs/dto/highlight-extension';
import { IBatchPayload } from '~libs/common';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';

import { THighlightDeepModel } from './types/highlight-deep-model.type';
import { IHighlightsRepository } from './highlights.repository.interface';

@injectable()
export class HighlightsRepository implements IHighlightsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	async create(highlight: Highlight): Promise<THighlightDeepModel> {
		return await this.prismaService.client.highlightModel.create({
			data: highlight,
			include: {
				startContainer: true,
				endContainer: true,
			},
		});
	}

	async update(
		id: number,
		payload: Omit<UpdateHighlightDto, 'startContainer' | 'endContainer'>
	): Promise<THighlightDeepModel> {
		return await this.prismaService.client.highlightModel.update({
			where: { id },
			data: payload,
			include: {
				startContainer: true,
				endContainer: true,
			},
		});
	}

	async updateMany(ids: number[], payload: Partial<HighlightModel>): Promise<IBatchPayload> {
		return await this.prismaService.client.highlightModel.updateMany({
			where: { id: { in: ids } },
			data: payload,
		});
	}

	async individualUpdateMany({
		highlights,
	}: IndividualUpdateHighlightsDto): Promise<THighlightDeepModel[]> {
		return await Promise.all(
			highlights.map(async ({ id, payload }) => {
				return await this.update(id, payload);
			})
		);
	}

	async findById(id: number): Promise<THighlightDeepModel | null> {
		return await this.prismaService.client.highlightModel.findFirst({
			where: { id },
			include: {
				startContainer: true,
				endContainer: true,
			},
		});
	}

	async findAllByIds(ids: number[]): Promise<THighlightDeepModel[]> {
		return await this.prismaService.client.highlightModel.findMany({
			where: {
				id: { in: ids },
			},
			include: {
				startContainer: true,
				endContainer: true,
			},
		});
	}

	async findAllByPageId(pageId: number): Promise<THighlightDeepModel[] | null> {
		return await this.prismaService.client.highlightModel.findMany({
			where: { pageId },
			orderBy: { order: 'asc' },
			include: {
				startContainer: true,
				endContainer: true,
			},
		});
	}

	async delete(id: number): Promise<HighlightModel> {
		return await this.prismaService.client.highlightModel.delete({
			where: { id },
		});
	}
}
