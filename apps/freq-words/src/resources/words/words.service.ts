/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetWordsMarksDto, UpsertWordMarkDto } from '~libs/dto/freq-words';
import { DefinitionDto } from '~libs/dto/freq-words/words/common/definition.dto';

import { WorkspacesService } from '../workspaces/workspaces.service';
import { LanguagesService } from '../languages/languages.service';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Definition } from '../translator/entities/definition.entity';
import { Example } from '../translator/entities/example.entity';
import { SourceService } from '../source/source.service';

import { WordMark } from './entities/word-mark.entity';
import { WordFormMark } from './entities/word-form-mark.entity';
import { WordForm } from './entities/word-form.entity';

@Injectable()
export class WordsService {
	constructor(
		@InjectRepository(WordForm) private wordFormRepository: Repository<WordForm>,
		@InjectRepository(WordMark) private wordMarkRepository: Repository<WordMark>,
		@InjectRepository(WordFormMark) private wordFormMarkRepository: Repository<WordFormMark>,
		@InjectRepository(Definition) private definitionRepository: Repository<Definition>,
		@InjectRepository(Example) private exampleRepository: Repository<Example>,
		private languagesService: LanguagesService,
		private sourceService: SourceService,
		private workspacesService: WorkspacesService
	) {}

	async upsertMark(
		dto: UpsertWordMarkDto
	): Promise<{ wordMarkId: number; wordFormMarkId: number }> {
		const language = await this.languagesService.getOne(dto.definitionFrom.languageId);
		const workspace = await this.workspacesService.getOne(dto.workspaceId);

		let lemmaMark: WordFormMark | null = null;
		if (dto.lemma && dto.lemma !== dto.wordForm) {
			const lemma = await this.preloadWordForm({ language, name: dto.lemma });
			lemmaMark = await this.preloadWordFormMark({ wordForm: lemma, isLemma: true }, workspace);
		}

		const wordForm = await this.preloadWordForm({
			language,
			name: dto.wordForm,
		});
		await this.preloadDefinition(dto.definitionFrom, wordForm);
		await this.preloadDefinition(dto.definitionTo, wordForm);
		const wordFormMark = await this.preloadWordFormMark(
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
		const wordMark = await this.preloadWordMark(workspace, wordFormMark, lemmaMark);

		await this.wordFormMarkRepository.update(wordFormMark.id, {
			count: wordFormMark.count + 1,
		});
		await this.wordMarkRepository.update(wordMark.id, {
			count: wordMark.count + 1,
		});

		return { wordMarkId: wordMark.id, wordFormMarkId: wordFormMark.id };
	}

	async getManyMarks({ workspaceId }: GetWordsMarksDto): Promise<WordMark[]> {
		const workspace = await this.workspacesService.getOne(workspaceId);
		return this.wordMarkRepository.find({
			where: { workspace },
		});
	}

	async getOneMark(id: number): Promise<WordMark> {
		const mark = await this.wordMarkRepository.findOne({
			where: { id },
			relations: { wordFormsMarks: { wordForm: { definitions: true } } },
		});
		if (!mark) {
			throw new NotFoundException({ err: `word mark #${id} not found` });
		}
		return mark;
	}

	async preloadDefinition(
		{ languageId, examples, description, synonyms }: DefinitionDto,
		wordForm: WordForm
	): Promise<Definition> {
		const language = await this.languagesService.getOne(languageId);
		const existedDefinition = await this.definitionRepository.findOne({
			where: { language, wordForm },
		});
		if (!existedDefinition) {
			const examplesEntities = await this.exampleRepository.create(
				examples.map((example) => ({ phrase: example }))
			);
			const synonymsEntities = await Promise.all(
				synonyms.map((synonym) => this.preloadWordForm({ language, name: synonym }))
			);
			const definitionEntity = this.definitionRepository.create({
				description,
				language,
				wordForm,
				examples: examplesEntities,
				synonyms: synonymsEntities,
			});
			return this.definitionRepository.save(definitionEntity);
		}
		return existedDefinition;
	}

	async preloadWordForm(data: Pick<WordForm, 'language' | 'name'>): Promise<WordForm> {
		const existedWordForm = await this.wordFormRepository.findOneBy({
			name: data.name,
			language: data.language,
		});
		if (!existedWordForm) {
			const newWordForm = this.wordFormRepository.create(data);
			return this.wordFormRepository.save(newWordForm);
		}
		return existedWordForm;
	}

	async preloadWordFormMark(
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

	async preloadWordMark(
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
			wordFormsMarks: lemmaMark ? [lemmaMark, wordFormMark] : [wordFormMark],
		});
		return this.wordMarkRepository.save(wordMark);
	}
}
