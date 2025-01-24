import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { UpsertWordMarkDto, GetWordMarksDto } from '~libs/dto/freq-words';
import { DefinitionDto } from '~libs/dto/freq-words/word-marks/common/definition.dto';

import { LanguagesService } from '../languages/languages.service';
import { SourceService } from '../source/source.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { WORKSPACE_ENTITY } from '../workspaces/stubs/workspaces';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../languages/stubs/languages';
import {
	DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
} from '../word-forms/stubs/definitions';
import { WordFormsService } from '../word-forms/word-forms.service';
import { LEMMA_ENTITY, WORD_FORM_ENTITY } from '../word-forms/stubs/word-forms';
import { WordForm } from '../word-forms/entities/word-form.entity';
import {
	EXAMPLES_ENGLISH_WORD_FORM_ENTITIES,
	EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES,
} from '../word-forms/stubs/examples';

import { WordMarksService } from './word-marks.service';
import { WordMark } from './entities/word-mark.entity';
import { WordFormMark } from './entities/word-form-mark.entity';
import { UPSERT_WORD_MARK_DTO, WORD_MARK_ENTITY } from './stubs/word-marks';
import { LEMMA_MARK_ENTITY } from './stubs/word-form-marks';

type TRepositoryMock<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createRepositoryMock: <T = any>() => TRepositoryMock<T> = () => ({
	find: jest.fn(),
	findOne: jest.fn(),
	findOneBy: jest.fn(),
	save: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	preload: jest.fn(),
	remove: jest.fn(),
});

describe('WordMarksService', () => {
	let service: WordMarksService;

	let wordMarkRepository: TRepositoryMock;
	let wordFormMarkRepository: TRepositoryMock;

	let languagesService: LanguagesService;
	let sourceService: SourceService;
	let workspacesService: WorkspacesService;
	let wordFormsService: WordFormsService;

	const languagesServiceMock = {
		getOne: jest.fn(),
	};

	const sourceServiceMock = {
		getOrUpsert: jest.fn(),
	};

	const workspacesServiceMock = {
		getOne: jest.fn(),
	};

	const wordFormsServiceMock = {
		getOrCreate: jest.fn(),
		getOrCreateDefinition: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WordMarksService,
				{ provide: getRepositoryToken(WordMark), useValue: createRepositoryMock() },
				{ provide: getRepositoryToken(WordFormMark), useValue: createRepositoryMock() },
				{ provide: LanguagesService, useValue: languagesServiceMock },
				{ provide: SourceService, useValue: sourceServiceMock },
				{ provide: WorkspacesService, useValue: workspacesServiceMock },
				{ provide: WordFormsService, useValue: wordFormsServiceMock },
			],
		}).compile();

		service = module.get<WordMarksService>(WordMarksService);

		wordMarkRepository = module.get<TRepositoryMock>(getRepositoryToken(WordMark));
		wordFormMarkRepository = module.get<TRepositoryMock>(getRepositoryToken(WordFormMark));

		languagesService = module.get<LanguagesService>(LanguagesService);
		sourceService = module.get<SourceService>(SourceService);
		workspacesService = module.get<WorkspacesService>(WorkspacesService);
		wordFormsService = module.get<WordFormsService>(WordFormsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('upsert mark', () => {
		let dto: UpsertWordMarkDto;
		let newLemmaMark: DeepPartial<WordFormMark>;
		let newWordFormMark: DeepPartial<WordFormMark>;

		beforeEach(() => {
			newLemmaMark = {
				id: 1,
				isLemma: true,
				count: 0,
				wordForm: LEMMA_ENTITY,
			};
			newWordFormMark = {
				id: 2,
				count: 0,
				wordForm: WORD_FORM_ENTITY,
			};
			languagesService.getOne = jest.fn().mockImplementation((languageId: number) => {
				switch (languageId) {
					case ENGLISH_LANGUAGE_ENTITY.id:
						return ENGLISH_LANGUAGE_ENTITY;
					case RUSSIAN_LANGUAGE_ENTITY.id:
						return RUSSIAN_LANGUAGE_ENTITY;
				}
			});
			workspacesService.getOne = jest.fn().mockResolvedValue(WORKSPACE_ENTITY);
			wordFormsService.getOrCreate = jest
				.fn()
				.mockImplementation(({ name }: Pick<WordForm, 'name' | 'language'>) => {
					switch (name) {
						case LEMMA_ENTITY.name:
							return LEMMA_ENTITY;
						case WORD_FORM_ENTITY.name:
							return WORD_FORM_ENTITY;
					}
				});
			wordFormMarkRepository.create.mockImplementation(
				({ isLemma }: Pick<WordFormMark, 'isLemma' | 'wordForm'>) => {
					return isLemma ? newLemmaMark : newWordFormMark;
				}
			);
			wordFormMarkRepository.save.mockImplementation((wordFormMark) => wordFormMark);
			wordFormsService.getOrCreateDefinition = jest
				.fn()
				.mockImplementation(({ languageId }: DefinitionDto) => {
					return languageId === ENGLISH_LANGUAGE_ENTITY.id
						? {
								...DEFINITION_WORD_FORM_ENGLISH_ENTITY,
								examples: EXAMPLES_ENGLISH_WORD_FORM_ENTITIES,
							}
						: {
								...DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
								examples: EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES,
							};
				});
			wordMarkRepository.create.mockReturnValue(WORD_MARK_ENTITY);
			wordMarkRepository.save.mockImplementation((wordMark) => wordMark);
		});

		describe(`pass unmarked lemma and word form`, () => {
			beforeEach(() => {
				dto = UPSERT_WORD_MARK_DTO('differ', true);
				wordFormMarkRepository.findOne.mockResolvedValue(null);
			});

			it(`should create two word form marks`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.save).toHaveBeenCalledWith(newLemmaMark);
				expect(wordFormMarkRepository.save).toHaveBeenCalledWith(newWordFormMark);
			});

			it(`should create word mark`, async () => {
				await service.upsert(dto);

				expect(wordMarkRepository.save).toHaveBeenCalledWith(WORD_MARK_ENTITY);
			});

			it(`should NOT increase count of lemma mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.update).toHaveBeenCalledTimes(1);
				expect(wordFormMarkRepository.update).not.toHaveBeenCalledWith(newLemmaMark.id, {
					count: newLemmaMark.count + 1,
				});
			});

			it(`should increase count of word mark and word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.update).toHaveBeenCalledWith(newWordFormMark.id, {
					count: newWordFormMark.count + 1,
				});
				expect(wordMarkRepository.update).toHaveBeenCalledWith(WORD_MARK_ENTITY.id, {
					count: WORD_MARK_ENTITY.count + 1,
				});
			});

			it(`should return IDs of word form mark whose counter has increased and its word mark`, async () => {
				const result = await service.upsert(dto);

				expect(result).toEqual({
					wordMarkId: WORD_MARK_ENTITY.id,
					wordFormMarkId: newWordFormMark.id,
				});
			});
		});

		describe(`pass marked lemma and unmarked word form`, () => {
			beforeEach(() => {
				dto = UPSERT_WORD_MARK_DTO('differ', true);
				wordFormMarkRepository.findOne.mockImplementation(
					({ where: { wordForm } }: { where: FindOptionsWhere<WordFormMark> }) => {
						switch (wordForm) {
							case LEMMA_ENTITY:
								return LEMMA_MARK_ENTITY;
							default:
								return null;
						}
					}
				);
			});

			it(`should create one word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.save).toHaveBeenCalledTimes(1);
				expect(wordFormMarkRepository.save).toHaveBeenCalledWith(newWordFormMark);
			});

			it(`should add created wordFormMark to existed word mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.update).toHaveBeenCalledWith(newWordFormMark.id, {
					wordMark: WORD_MARK_ENTITY,
				});
				expect(wordMarkRepository.save).not.toHaveBeenCalled();
			});

			it(`should NOT increase count of lemma mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.update).toHaveBeenCalledTimes(2);
				expect(wordFormMarkRepository.update).not.toHaveBeenCalledWith(LEMMA_MARK_ENTITY.id, {
					count: LEMMA_MARK_ENTITY.count + 1,
				});
			});

			it(`should increase count of word mark and word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.update).toHaveBeenCalledWith(newWordFormMark.id, {
					count: newWordFormMark.count + 1,
				});
				expect(wordMarkRepository.update).toHaveBeenCalledWith(WORD_MARK_ENTITY.id, {
					count: WORD_MARK_ENTITY.count + 1,
				});
			});

			it(`should return IDs of word form mark whose counter has increased and its word mark`, async () => {
				const result = await service.upsert(dto);

				expect(result).toEqual({
					wordMarkId: WORD_MARK_ENTITY.id,
					wordFormMarkId: newWordFormMark.id,
				});
			});
		});

		describe(`pass unmarked lemma with source`, () => {
			beforeEach(() => {
				dto = UPSERT_WORD_MARK_DTO('equal', true, true);
				wordFormMarkRepository.findOne.mockResolvedValue(null);
			});

			it(`should create lemma mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.save).toHaveBeenCalledTimes(1);
				expect(wordFormMarkRepository.save).toHaveBeenCalledWith(newLemmaMark);
			});

			it(`should create word mark`, async () => {
				await service.upsert(dto);

				expect(wordMarkRepository.save).toHaveBeenCalledWith(WORD_MARK_ENTITY);
			});

			it(`should call sourceService to check source and upsert with lemma mark if it needs`, async () => {
				await service.upsert(dto);

				expect(sourceService.getOrUpsert).toHaveBeenCalled();
			});

			it(`should increase count of lemma and word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepository.update).toHaveBeenCalledWith(newLemmaMark.id, {
					count: newLemmaMark.count + 1,
				});
				expect(wordMarkRepository.update).toHaveBeenCalledWith(WORD_MARK_ENTITY.id, {
					count: WORD_MARK_ENTITY.count + 1,
				});
			});

			it(`should return IDs of word form mark whose counter has increased and its word mark`, async () => {
				const result = await service.upsert(dto);

				expect(result).toEqual({
					wordMarkId: WORD_MARK_ENTITY.id,
					wordFormMarkId: newLemmaMark.id,
				});
			});
		});
	});

	describe('get many marks', () => {
		it('should return all marks for a workspace', async () => {
			const dto: GetWordMarksDto = { workspaceId: WORKSPACE_ENTITY.id };
			workspacesService.getOne = jest.fn().mockResolvedValue(WORKSPACE_ENTITY);
			wordMarkRepository.find.mockResolvedValue([WORD_MARK_ENTITY]);

			const result = await service.getMany(dto);

			expect(wordMarkRepository.find).toHaveBeenCalledWith({
				where: { workspace: WORKSPACE_ENTITY },
			});
			expect(result).toEqual([WORD_MARK_ENTITY]);
		});
	});

	describe('get one mark', () => {
		describe(`pass id of an existing mark`, () => {
			it('should return a mark by id', async () => {
				wordMarkRepository.findOne.mockResolvedValue(WORD_MARK_ENTITY);

				const result = await service.getOne(WORD_MARK_ENTITY.id);

				expect(result).toEqual(WORD_MARK_ENTITY);
			});
		});

		describe(`pass id of a non-existing mark`, () => {
			it('should throw NotFoundException', async () => {
				wordMarkRepository.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
