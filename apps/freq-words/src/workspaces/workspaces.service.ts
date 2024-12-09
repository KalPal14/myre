import { Injectable } from '@nestjs/common';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
	create(createWorkspaceDto: CreateWorkspaceDto): string {
		return 'This action adds a new workspace';
	}

	findAll(): string {
		return `This action returns all workspaces`;
	}

	findOne(id: number): string {
		return `This action returns a #${id} workspace`;
	}

	update(id: number, updateWorkspaceDto: UpdateWorkspaceDto): string {
		return `This action updates a #${id} workspace`;
	}

	remove(id: number): string {
		return `This action removes a #${id} workspace`;
	}
}
