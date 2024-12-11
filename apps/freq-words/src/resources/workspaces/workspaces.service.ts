import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';

import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/freq-words';
import { IJwtPayload } from '~libs/common/index';

import { LanguagesService } from '../languages/languages.service';

import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
	constructor(
		@InjectRepository(Workspace) private workspaceRepository: Repository<Workspace>,
		private languagesService: LanguagesService
	) {}

	async create(user: IJwtPayload, dto: CreateWorkspaceDto): Promise<Workspace> {
		const knownLanguage = await this.languagesService.getOne(dto.knownLanguageId);
		const targetLanguage = await this.languagesService.getOne(dto.targetLanguageId);
		const workspaceName = dto.name ?? `${knownLanguage.name}-${targetLanguage.name}`;

		const existingWorkspace = await this.workspaceRepository.findOne({
			where: { ownerId: user.id, name: workspaceName },
		});
		if (existingWorkspace) {
			throw new BadRequestException({
				err: `User ${user.username} already has '${workspaceName}' workspace`,
			});
		}

		const workspace = this.workspaceRepository.create({
			ownerId: user.id,
			name: workspaceName,
			knownLanguage,
			targetLanguage,
		});
		return this.workspaceRepository.save(workspace);
	}

	getMany(user: IJwtPayload): Promise<Workspace[]> {
		return this.workspaceRepository.find({ where: { ownerId: user.id } });
	}

	async getOne(id: number, relations?: FindOptionsRelations<Workspace>): Promise<Workspace> {
		const workspace = await this.workspaceRepository.findOne({
			where: { id },
			relations,
		});
		if (!workspace) {
			throw new NotFoundException({ err: `Workspace #${id} not found` });
		}
		return workspace;
	}

	async update(id: number, dto: UpdateWorkspaceDto): Promise<Workspace> {
		const workspace = await this.workspaceRepository.preload({ id, ...dto });
		if (!workspace) {
			throw new NotFoundException({ err: `Workspace #${id} not found` });
		}
		return this.workspaceRepository.save(workspace);
	}

	async delete(id: number): Promise<Workspace> {
		const workspace = await this.getOne(id);
		await this.workspaceRepository.remove(workspace);
		return { ...workspace, id };
	}
}
