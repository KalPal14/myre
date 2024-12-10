import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
	constructor(private readonly workspacesService: WorkspacesService) {}

	@Post()
	create(@Body() createWorkspaceDto: CreateWorkspaceDto): string {
		return this.workspacesService.create(createWorkspaceDto);
	}

	@Get()
	findAll(): string {
		return this.workspacesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string): string {
		return this.workspacesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto): string {
		return this.workspacesService.update(+id, updateWorkspaceDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string): string {
		return this.workspacesService.remove(+id);
	}
}
