import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { WorkspaceModel } from '~/highlight-extension/prisma/client';
import { TYPES } from '~/highlight-extension/common/constants/types';
import { TPrismaService } from '~/highlight-extension/common/types/prisma-service.interface';
import { Workspace } from '~/highlight-extension/domain/workspace/workspace';

import { IWorkspacesRepository } from './workspaces.repository.interface';
import { IWorkspaceDeepModel } from './types/workspace-deep-model.interface';

@injectable()
export class WorkspacesRepository implements IWorkspacesRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	findBy(findData: Partial<Omit<WorkspaceModel, 'colors'>>): Promise<WorkspaceModel | null> {
		return this.prismaService.client.workspaceModel.findFirst({
			where: findData,
		});
	}

	deepFindBy(
		findData: Partial<Omit<WorkspaceModel, 'colors'>>
	): Promise<IWorkspaceDeepModel | null> {
		return this.prismaService.client.workspaceModel.findFirst({
			where: findData,
			include: { pages: true },
		});
	}

	findManyBy(findData: Partial<Omit<WorkspaceModel, 'colors'>>): Promise<WorkspaceModel[]> {
		return this.prismaService.client.workspaceModel.findMany({
			where: findData,
		});
	}

	create(workspace: Workspace): Promise<WorkspaceModel> {
		return this.prismaService.client.workspaceModel.create({
			data: workspace,
		});
	}

	update(id: number, payload: Partial<Workspace>): Promise<WorkspaceModel> {
		return this.prismaService.client.workspaceModel.update({
			where: { id },
			data: payload,
		});
	}

	delete(id: number): Promise<WorkspaceModel> {
		return this.prismaService.client.workspaceModel.delete({ where: { id } });
	}
}
