import { inject, injectable } from 'inversify';
import { HighlightModel } from '@prisma/client';

import { IHighlightsRepository } from './highlights.repository.interface';
import { THighlightDeepModel } from './types/highlight-deep-model.type';

import TYPES from '@/common/constants/types.inversify';
import { UpdateHighlightDto } from '@/dto/highlights/update-highlight.dto';
import { IHighlight } from '@/entities/highlight-entity/highlight.entity.interface';
import { IPrismaService } from '@/utils/services/prisma-service/prisma.service.interface';
import { IndividualUpdateHighlightsDto } from '@/dto/highlights/individual-update-highlights.dto';
import { IBatchPayload } from '@/common/types/batch-payload.interface';

@injectable()
export class HighlightsRepository implements IHighlightsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create(highlight: IHighlight): Promise<THighlightDeepModel> {
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
