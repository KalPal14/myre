import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetWordsMarksDto, UpsertWordMarkDto } from '~libs/dto/freq-words';

import { WorkspacesService } from '../workspaces/workspaces.service';
import { LanguagesService } from '../languages/languages.service';
import { Workspace } from '../workspaces/entities/workspace.entity';

import { WordMark } from './entities/word-mark.entity';
import { WordFormMark } from './entities/word-form-mark.entity';
import { WordForm } from './entities/word-form.entity';

@Injectable()
export class WordsService {
	constructor(
		@InjectRepository(WordForm) private wordFormRepository: Repository<WordForm>,
		@InjectRepository(WordMark) private wordMarkRepository: Repository<WordMark>,
		@InjectRepository(WordFormMark) private wordFormMarkRepository: Repository<WordFormMark>,
		private languagesService: LanguagesService,
		private workspacesService: WorkspacesService
	) {}

	async upsertMark(dto: UpsertWordMarkDto): Promise<WordMark> {
		const language = await this.languagesService.getOne(dto.word.languageId);
		const workspace = await this.workspacesService.getOne(dto.workspaceId);

		let lemmaMark: WordFormMark | null = null;
		if (dto.word.lemma && dto.word.lemma !== dto.word.name) {
			const lemma = await this.preloadWordForm({ isLemma: true, language, name: dto.word.lemma });
			lemmaMark = await this.preloadWordFormMark({ wordForm: lemma }, workspace);
		}
		const wordForm = await this.preloadWordForm({ isLemma: false, language, name: dto.word.name });
		const wordFormMark = await this.preloadWordFormMark({ wordForm }, workspace);
		const wordMark = await this.preloadWordMark(workspace, wordFormMark, lemmaMark);

		await this.wordFormMarkRepository.update(wordFormMark, { count: wordFormMark.count + 1 });
		await this.wordMarkRepository.update(wordMark.id, { count: wordMark.count + 1 });
		return wordMark;
	}

	async getManyMarks({ workspaceId }: GetWordsMarksDto): Promise<WordMark[]> {
		const workspace = await this.workspacesService.getOne(workspaceId);
		return this.wordMarkRepository.find({
			where: { workspace },
			relations: { wordFormsMarks: { wordForm: true } },
		});
	}

	async getOneMark(id: number): Promise<WordMark> {
		const mark = await this.wordMarkRepository.findOne({
			where: { id },
			relations: { wordFormsMarks: { wordForm: true } },
		});
		if (!mark) {
			throw new NotFoundException({ err: `word mark #${id} not found` });
		}
		return mark;
	}

	async preloadWordForm(data: Pick<WordForm, 'isLemma' | 'language' | 'name'>): Promise<WordForm> {
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
		{ wordForm }: Pick<WordFormMark, 'wordForm'>,
		workspace: Workspace
	): Promise<WordFormMark> {
		const existedWordFormMark = await this.wordFormMarkRepository.findOne({
			where: { wordForm, wordMark: { workspace } },
		});
		if (!existedWordFormMark) {
			const newWordFormMark = this.wordFormMarkRepository.create({ wordForm });
			return this.wordFormMarkRepository.save(newWordFormMark);
		}
		return existedWordFormMark;
	}

	async preloadWordMark(
		workspace: Workspace,
		wordFormMark: WordFormMark,
		lemmaMark: WordFormMark | null
	): Promise<WordMark> {
		const existedWordMark = await this.wordMarkRepository.findOne({
			where: { workspace, wordFormsMarks: [lemmaMark ?? wordFormMark] },
			relations: { wordFormsMarks: { wordForm: true } },
		});
		if (!existedWordMark) {
			const newWordMark = this.wordMarkRepository.create({
				workspace,
				wordFormsMarks: lemmaMark ? [lemmaMark, wordFormMark] : [wordFormMark],
			});
			return this.wordMarkRepository.save(newWordMark);
		}
		if (!wordFormMark.wordMark) {
			await this.wordFormMarkRepository.update(wordFormMark, { wordMark: existedWordMark });
		}
		return existedWordMark;
	}
}
