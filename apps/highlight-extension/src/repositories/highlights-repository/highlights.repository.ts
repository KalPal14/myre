import { inject, injectable } from 'inversify';

import { IndividualUpdateHighlightsDto } from '~libs/dto/highlight-extension';
import { IBatchPayload, toWhereIn } from '~libs/common';

import { HighlightModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';
import { Highlight } from '~/highlight-extension/domain/highlight/highlight';

import { IHighlightDeepModel } from './types/highlight-deep-model.interface';
import { IHighlightsRepository } from './highlights.repository.interface';

@injectable()
export class HighlightsRepository implements IHighlightsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	findBy(findData: Partial<HighlightModel>): Promise<HighlightModel | null> {
		return this.prismaService.client.highlightModel.findFirst({
			where: findData,
		});
	}

	deepFindBy(findData: Partial<HighlightModel>): Promise<IHighlightDeepModel | null> {
		return this.prismaService.client.highlightModel.findFirst({
			where: findData,
			include: { startContainer: true, endContainer: true },
		});
	}

	findManyBy(findData: Partial<HighlightModel>): Promise<HighlightModel[]> {
		return this.prismaService.client.highlightModel.findMany({
			where: findData,
		});
	}

	deepFindManyBy(findData: Partial<HighlightModel>): Promise<IHighlightDeepModel[]> {
		return this.prismaService.client.highlightModel.findMany({
			where: findData,
			include: { startContainer: true, endContainer: true },
		});
	}

	deepFindManyIn(
		findData: Partial<{ [K in keyof HighlightModel]: HighlightModel[K][] }>
	): Promise<IHighlightDeepModel[]> {
		return this.prismaService.client.highlightModel.findMany({
			where: toWhereIn(findData),
			include: { startContainer: true, endContainer: true },
		});
	}

	create(highlight: Highlight): Promise<IHighlightDeepModel> {
		return this.prismaService.client.highlightModel.create({
			data: highlight,
			include: { startContainer: true, endContainer: true },
		});
	}

	update(id: number, payload: Partial<Highlight>): Promise<IHighlightDeepModel> {
		return this.prismaService.client.highlightModel.update({
			where: { id },
			data: payload,
			include: { startContainer: true, endContainer: true },
		});
	}

	updateMany(ids: number[], payload: Partial<Highlight>): Promise<IBatchPayload> {
		return this.prismaService.client.highlightModel.updateMany({
			where: { id: { in: ids } },
			data: payload,
		});
	}

	async individualUpdateMany({
		highlights,
	}: IndividualUpdateHighlightsDto): Promise<IHighlightDeepModel[]> {
		return await Promise.all(
			highlights.map(async ({ id, payload }) => {
				return await this.update(id, payload);
			})
		);
	}

	delete(id: number): Promise<HighlightModel> {
		return this.prismaService.client.highlightModel.delete({
			where: { id },
		});
	}
}
