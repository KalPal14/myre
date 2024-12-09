import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { BaseController, TController, ValidateMiddleware } from '~libs/express-core';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/highlight-extension';
import { WORKSPACES_ENDPOINTS } from '~libs/routes/highlight-extension';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IWorkspacesService } from '~/highlight-extension/services/workspaces-service/workspaces.service.interface';

import { IWorkspacesController } from './workspaces.controller.interface';

@injectable()
export class WorkspacesController extends BaseController implements IWorkspacesController {
	constructor(@inject(TYPES.WorkspacesService) private workspacesService: IWorkspacesService) {
		super();
		this.bindRoutes([
			{
				path: WORKSPACES_ENDPOINTS.get,
				method: 'get',
				func: this.get,
			},
			{
				path: WORKSPACES_ENDPOINTS.getAllOwners,
				method: 'get',
				func: this.getAllOwners,
			},
			{
				path: WORKSPACES_ENDPOINTS.create,
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(CreateWorkspaceDto)],
			},
			{
				path: WORKSPACES_ENDPOINTS.update,
				method: 'patch',
				func: this.update,
				middlewares: [new ValidateMiddleware(UpdateWorkspaceDto)],
			},
			{
				path: WORKSPACES_ENDPOINTS.delete,
				method: 'delete',
				func: this.delete,
			},
		]);
	}

	get: TController<{ id: string }> = async ({ params: { id } }, res, next) => {
		const result = await this.workspacesService.get(+id);
		this.ok(res, result);
	};

	getAllOwners: TController = async ({ user }, res) => {
		const result = await this.workspacesService.getAllOwners(+user.id);
		this.ok(res, result);
	};

	create: TController<null, CreateWorkspaceDto> = async ({ user, body }, res) => {
		const result = await this.workspacesService.create(user.id, body);
		this.ok(res, result);
	};

	update: TController<{ id: string }, UpdateWorkspaceDto> = async ({ params, body }, res) => {
		const result = await this.workspacesService.update(+params.id, body);
		this.ok(res, result);
	};

	delete: TController<{ id: string }> = async ({ params: { id } }, res) => {
		const result = await this.workspacesService.delete(+id);
		this.ok(res, result);
	};
}
