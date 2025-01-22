import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetWordMarksDto, UpsertWordMarkDto } from '~libs/dto/freq-words';

import { WorkspacesService } from '../workspaces/workspaces.service';
import { LanguagesService } from '../languages/languages.service';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { SourceService } from '../source/source.service';
import { WordFormsService } from '../word-forms/word-forms.service';

import { WordMark } from './entities/word-mark.entity';
import { WordFormMark } from './entities/word-form-mark.entity';

@Injectable()
export class WordMarksService {
	constructor(
		@InjectRepository(WordMark) private wordMarkRepository: Repository<WordMark>,
		@InjectRepository(WordFormMark) private wordFormMarkRepository: Repository<WordFormMark>,
		private languagesService: LanguagesService,
		private sourceService: SourceService,
		private workspacesService: WorkspacesService,
		private wordFormsService: WordFormsService
	) {}

	async upsert(dto: UpsertWordMarkDto): Promise<{ wordMarkId: number; wordFormMarkId: number }> {
		const language = await this.languagesService.getOne(dto.definitionFrom.languageId);
		const workspace = await this.workspacesService.getOne(dto.workspaceId);

		let lemmaMark: WordFormMark | null = null;
		if (dto.lemma && dto.lemma !== dto.wordForm) {
			const lemma = await this.wordFormsService.getOrCreate({ language, name: dto.lemma });
			lemmaMark = await this.getOrCreateWordFormMark({ wordForm: lemma, isLemma: true }, workspace);
		}

		const wordForm = await this.wordFormsService.getOrCreate({
			language,
			name: dto.wordForm,
		});
		await this.wordFormsService.getOrCreateDefinition(dto.definitionFrom, wordForm);
		await this.wordFormsService.getOrCreateDefinition(dto.definitionTo, wordForm);
		const wordFormMark = await this.getOrCreateWordFormMark(
			{ wordForm, isLemma: dto.lemma === dto.wordForm },
			workspace
		);
		if (dto.sourceLink) {
			await this.sourceService.getOrUpsert({
				link: dto.sourceLink,
				workspaceId: dto.workspaceId,
				wordFormMark,
			});
		}
		const wordMark = await this.getOrCreate(workspace, wordFormMark, lemmaMark);

		await this.wordFormMarkRepository.update(wordFormMark.id, {
			count: wordFormMark.count + 1,
		});
		await this.wordMarkRepository.update(wordMark.id, {
			count: wordMark.count + 1,
		});

		return { wordMarkId: wordMark.id, wordFormMarkId: wordFormMark.id };
	}

	async getMany({ workspaceId }: GetWordMarksDto): Promise<WordMark[]> {
		const workspace = await this.workspacesService.getOne(workspaceId);
		return this.wordMarkRepository.find({
			where: { workspace },
		});
	}

	async getOne(id: number): Promise<WordMark> {
		const mark = await this.wordMarkRepository.findOne({
			where: { id },
			relations: { wordFormMarks: { wordForm: { definitions: true } } },
		});
		if (!mark) {
			throw new NotFoundException({ err: `word mark #${id} not found` });
		}
		return mark;
	}

	async getOrCreate(
		workspace: Workspace,
		wordFormMark: WordFormMark,
		lemmaMark: WordFormMark | null
	): Promise<WordMark> {
		if (wordFormMark.wordMark) {
			return wordFormMark.wordMark;
		}
		if (lemmaMark?.wordMark) {
			await this.wordFormMarkRepository.update(wordFormMark.id, { wordMark: lemmaMark.wordMark });
			return lemmaMark.wordMark;
		}
		const wordMark = this.wordMarkRepository.create({
			workspace,
			wordFormMarks: lemmaMark ? [lemmaMark, wordFormMark] : [wordFormMark],
		});
		return this.wordMarkRepository.save(wordMark);
	}

	async getOrCreateWordFormMark(
		{ wordForm, isLemma }: Pick<WordFormMark, 'wordForm' | 'isLemma'>,
		workspace: Workspace
	): Promise<WordFormMark> {
		const existedWordFormMark = await this.wordFormMarkRepository.findOne({
			where: { wordForm, wordMark: { workspace } },
			relations: { wordMark: true },
		});
		if (!existedWordFormMark) {
			const newWordFormMark = this.wordFormMarkRepository.create({ wordForm, isLemma });
			return this.wordFormMarkRepository.save(newWordFormMark);
		}
		return existedWordFormMark;
	}
}
