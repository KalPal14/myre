import { inject, injectable } from 'inversify';

import { IPrismaService } from '~libs/express-core';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { UpdateHighlightDto } from '~/highlight-extension/dto/highlights/update-highlight.dto';
import { IHighlight } from '~/highlight-extension/entities/highlight-entity/highlight.entity.interface';
import { IndividualUpdateHighlightsDto } from '~/highlight-extension/dto/highlights/individual-update-highlights.dto';
import { IBatchPayload } from '~/highlight-extension/common/types/batch-payload.interface';

import { THighlightDeepModel } from './types/highlight-deep-model.type';
import { IHighlightsRepository } from './highlights.repository.interface';

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
