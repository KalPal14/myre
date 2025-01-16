import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetOrCreateSourceDto, GetSourcesDto, UpdateSourceDto } from '~libs/dto/freq-words';

import { WorkspacesService } from '../workspaces/workspaces.service';
import { WordFormMark } from '../words/entities/word-form-mark.entity';

import { Source } from './entities/source.entity';

@Injectable()
export class SourceService {
	constructor(
		private workspacesService: WorkspacesService,
		@InjectRepository(Source) private sourceRepository: Repository<Source>
	) {}

	async getOrCreate({ link, workspaceId }: GetOrCreateSourceDto): Promise<Source> {
		const workspace = await this.workspacesService.getOne(workspaceId);
		const existedSource = await this.sourceRepository.findOne({
			where: { link, workspace },
			relations: { wordFormsMarks: true },
		});
		if (!existedSource) {
			const newSource = this.sourceRepository.create({ link, workspace, wordFormsMarks: [] });
			return this.sourceRepository.save(newSource);
		}
		return existedSource;
	}

	async getOrUpsert({
		link,
		workspaceId,
		wordFormMark,
	}: {
		link: string;
		workspaceId: number;
		wordFormMark: WordFormMark;
	}): Promise<Source> {
		const source = await this.getOrCreate({ link, workspaceId });
		const sourceWithWordFormMark = await this.sourceRepository.findOne({
			where: { id: source.id, wordFormsMarks: wordFormMark },
		});
		if (!sourceWithWordFormMark) {
			return this.sourceRepository.save({
				...source,
				wordFormsMarks: [...source.wordFormsMarks, wordFormMark],
			});
		}
		return source;
	}

	async getMany({ workspaceId }: GetSourcesDto): Promise<Source[]> {
		const workspace = await this.workspacesService.getOne(workspaceId);
		return this.sourceRepository.find({ where: { workspace } });
	}

	async getOne(id: number): Promise<Source> {
		const existedSource = await this.sourceRepository.findOne({
			where: { id },
			relations: { workspace: true, wordFormsMarks: true },
		});
		if (!existedSource) {
			throw new NotFoundException({ err: `Source #${id} not found` });
		}
		return existedSource;
	}

	async update(id: number, dto: UpdateSourceDto): Promise<Source> {
		const source = await this.getOne(id);
		return this.sourceRepository.save({ ...source, ...dto });
	}

	async delete(id: number): Promise<Source> {
		const source = await this.getOne(id);
		await this.sourceRepository.remove(source);
		return { ...source, id };
	}
}
