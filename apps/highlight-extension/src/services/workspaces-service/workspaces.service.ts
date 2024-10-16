import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/highlight-extension';
import { HTTPError } from '~libs/express-core';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IWorkspacesRepository } from '~/highlight-extension/repositories/workspaces-repository/workspaces.repository.interface';
import { IWorkspaceFactory } from '~/highlight-extension/domain/workspace/factory/workspace-factory.interface';
import { WorkspaceModel } from '~/highlight-extension/prisma/client';

import { IWorkspacesService } from './workspaces.service.interface';

@injectable()
export class WorkspacesService implements IWorkspacesService {
	constructor(
		@inject(TYPES.WorkspacesRepository) private workspacesRepository: IWorkspacesRepository,
		@inject(TYPES.WorkspaceFactory) private workspaceFactory: IWorkspaceFactory
	) {}

	async get(id: number): Promise<WorkspaceModel> {
		const workspace = await this.workspacesRepository.deepFindBy({ id });
		if (!workspace) {
			throw new HTTPError(404, `highlight #${id} not found`);
		}

		return workspace;
	}

	getAllOwners(ownerId: number): Promise<WorkspaceModel[]> {
		return this.workspacesRepository.findManyBy({ ownerId });
	}

	create(ownerId: number, workspace: CreateWorkspaceDto): Promise<WorkspaceModel> {
		const newWorkspace = this.workspaceFactory.create({ ownerId, ...workspace });
		return this.workspacesRepository.create(newWorkspace);
	}

	async update(id: number, payload: UpdateWorkspaceDto): Promise<WorkspaceModel> {
		await this.get(id);
		return this.workspacesRepository.update(id, payload);
	}

	async delete(id: number): Promise<WorkspaceModel> {
		await this.get(id);
		return this.workspacesRepository.delete(id);
	}
}
