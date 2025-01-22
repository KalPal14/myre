import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { Request } from 'express';

import {
	ICreateWorkspaceRo,
	IDeleteWorkspaceRo,
	IGetWorkspaceRo,
	IUpdateWorkspaceRo,
	TGetOwnersWorkspacesRo,
} from '~libs/ro/freq-words';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/freq-words';
import { WORKSPACES_BASE_ROUTE, WORKSPACES_ENDPOINTS } from '~libs/routes/freq-words';

import { WorkspacesService } from './workspaces.service';

@Controller(WORKSPACES_BASE_ROUTE)
export class WorkspacesController {
	constructor(private readonly workspacesService: WorkspacesService) {}

	@Post(WORKSPACES_ENDPOINTS.create)
	create(@Req() { user }: Request, @Body() body: CreateWorkspaceDto): Promise<ICreateWorkspaceRo> {
		return this.workspacesService.create(user, body);
	}

	@Get(WORKSPACES_ENDPOINTS.getOwnersWorkspaces)
	getMany(@Req() { user }: Request): Promise<TGetOwnersWorkspacesRo> {
		return this.workspacesService.getMany(user);
	}

	@Get(WORKSPACES_ENDPOINTS.get)
	getOne(@Param('id') id: string): Promise<IGetWorkspaceRo> {
		return this.workspacesService.getOne(+id, {
			sources: true,
		});
	}

	@Patch(WORKSPACES_ENDPOINTS.update)
	update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto): Promise<IUpdateWorkspaceRo> {
		return this.workspacesService.update(+id, dto);
	}

	@Delete(WORKSPACES_ENDPOINTS.delete)
	async delete(@Param('id') id: string): Promise<IDeleteWorkspaceRo> {
		const res = await this.workspacesService.delete(+id);
		return res;
	}
}
