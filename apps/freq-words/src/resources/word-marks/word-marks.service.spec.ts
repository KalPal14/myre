import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { UpsertWordMarkDto, GetWordMarksDto } from '~libs/dto/freq-words';
import { DefinitionDto } from '~libs/dto/freq-words/word-marks/common/definition.dto';

import { LanguagesService } from '../languages/languages.service';
import { SourceService } from '../source/source.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { WORKSPACE_ENTITY } from '../workspaces/mocks/workspaces';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../languages/mocks/languages';
import {
	DEFINITION_WORD_FORM_ENGLISH_ENTITY,
	DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
} from '../word-forms/mocks/definitions';
import { WordFormsService } from '../word-forms/word-forms.service';
import { LEMMA_ENTITY, WORD_FORM_ENTITY } from '../word-forms/mocks/word-forms';
import { WordForm } from '../word-forms/entities/word-form.entity';
import {
	EXAMPLES_ENGLISH_WORD_FORM_ENTITIES,
	EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES,
} from '../word-forms/mocks/examples';

import { WordMarksService } from './word-marks.service';
import { WordMark } from './entities/word-mark.entity';
import { WordFormMark } from './entities/word-form-mark.entity';
import { UPSERT_WORD_MARK_DTO, WORD_MARK_ENTITY } from './mocks/word-marks';
import { LEMMA_MARK_ENTITY } from './mocks/word-form-marks';

describe('WordMarksService', () => {
	let service: WordMarksService;

	const createTypeOrmRepositoryMock = (): Record<
		keyof Pick<
			Repository<any>,
			'find' | 'findOne' | 'findOneBy' | 'save' | 'create' | 'update' | 'preload' | 'remove'
		>,
		jest.Mock
	> => ({
		find: jest.fn(),
		findOne: jest.fn(),
		findOneBy: jest.fn(),
		save: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		preload: jest.fn(),
		remove: jest.fn(),
	});
	const wordMarkRepositoryMock = createTypeOrmRepositoryMock();
	const wordFormMarkRepositoryMock = createTypeOrmRepositoryMock();

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
				{ provide: getRepositoryToken(WordMark), useValue: wordMarkRepositoryMock },
				{ provide: getRepositoryToken(WordFormMark), useValue: wordFormMarkRepositoryMock },
				{ provide: LanguagesService, useValue: languagesServiceMock },
				{ provide: SourceService, useValue: sourceServiceMock },
				{ provide: WorkspacesService, useValue: workspacesServiceMock },
				{ provide: WordFormsService, useValue: wordFormsServiceMock },
			],
		}).compile();

		service = module.get<WordMarksService>(WordMarksService);
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
			languagesServiceMock.getOne.mockImplementation((languageId: number) => {
				switch (languageId) {
					case ENGLISH_LANGUAGE_ENTITY.id:
						return ENGLISH_LANGUAGE_ENTITY;
					case RUSSIAN_LANGUAGE_ENTITY.id:
						return RUSSIAN_LANGUAGE_ENTITY;
				}
			});
			workspacesServiceMock.getOne.mockResolvedValue(WORKSPACE_ENTITY);
			wordFormsServiceMock.getOrCreate.mockImplementation(
				({ name }: Pick<WordForm, 'name' | 'language'>) => {
					switch (name) {
						case LEMMA_ENTITY.name:
							return LEMMA_ENTITY;
						case WORD_FORM_ENTITY.name:
							return WORD_FORM_ENTITY;
					}
				}
			);
			wordFormMarkRepositoryMock.create.mockImplementation(
				({ isLemma }: Pick<WordFormMark, 'isLemma' | 'wordForm'>) => {
					return isLemma ? newLemmaMark : newWordFormMark;
				}
			);
			wordFormMarkRepositoryMock.save.mockImplementation((wordFormMark) => wordFormMark);
			wordFormsServiceMock.getOrCreateDefinition.mockImplementation(
				({ languageId }: DefinitionDto) => {
					return languageId === ENGLISH_LANGUAGE_ENTITY.id
						? {
								...DEFINITION_WORD_FORM_ENGLISH_ENTITY,
								examples: EXAMPLES_ENGLISH_WORD_FORM_ENTITIES,
							}
						: {
								...DEFINITION_WORD_FORM_RUSSIAN_ENTITY,
								examples: EXAMPLES_RUSSIAN_WORD_FORM_ENTITIES,
							};
				}
			);
			wordMarkRepositoryMock.create.mockReturnValue(WORD_MARK_ENTITY);
			wordMarkRepositoryMock.save.mockImplementation((wordMark) => wordMark);
		});

		describe(`pass unmarked lemma and word form`, () => {
			beforeEach(() => {
				dto = UPSERT_WORD_MARK_DTO('differ', true);
				wordFormMarkRepositoryMock.findOne.mockResolvedValue(null);
			});

			it(`should create two word form marks`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.save).toHaveBeenCalledWith(newLemmaMark);
				expect(wordFormMarkRepositoryMock.save).toHaveBeenCalledWith(newWordFormMark);
			});

			it(`should create word mark`, async () => {
				await service.upsert(dto);

				expect(wordMarkRepositoryMock.save).toHaveBeenCalledWith(WORD_MARK_ENTITY);
			});

			it(`should NOT increase count of lemma mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.update).toHaveBeenCalledTimes(1);
				expect(wordFormMarkRepositoryMock.update).not.toHaveBeenCalledWith(newLemmaMark.id, {
					count: newLemmaMark.count! + 1,
				});
			});

			it(`should increase count of word mark and word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.update).toHaveBeenCalledWith(newWordFormMark.id, {
					count: newWordFormMark.count! + 1,
				});
				expect(wordMarkRepositoryMock.update).toHaveBeenCalledWith(WORD_MARK_ENTITY.id, {
					count: WORD_MARK_ENTITY.count! + 1,
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
				wordFormMarkRepositoryMock.findOne.mockImplementation(
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

				expect(wordFormMarkRepositoryMock.save).toHaveBeenCalledTimes(1);
				expect(wordFormMarkRepositoryMock.save).toHaveBeenCalledWith(newWordFormMark);
			});

			it(`should add created wordFormMark to existed word mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.update).toHaveBeenCalledWith(newWordFormMark.id!, {
					wordMark: WORD_MARK_ENTITY,
				});
				expect(wordMarkRepositoryMock.save).not.toHaveBeenCalled();
			});

			it(`should NOT increase count of lemma mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.update).toHaveBeenCalledTimes(2);
				expect(wordFormMarkRepositoryMock.update).not.toHaveBeenCalledWith(LEMMA_MARK_ENTITY.id, {
					count: LEMMA_MARK_ENTITY.count! + 1,
				});
			});

			it(`should increase count of word mark and word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.update).toHaveBeenCalledWith(newWordFormMark.id, {
					count: newWordFormMark.count! + 1,
				});
				expect(wordMarkRepositoryMock.update).toHaveBeenCalledWith(WORD_MARK_ENTITY.id, {
					count: WORD_MARK_ENTITY.count! + 1,
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
				wordFormMarkRepositoryMock.findOne.mockResolvedValue(null);
			});

			it(`should create lemma mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.save).toHaveBeenCalledTimes(1);
				expect(wordFormMarkRepositoryMock.save).toHaveBeenCalledWith(newLemmaMark);
			});

			it(`should create word mark`, async () => {
				await service.upsert(dto);

				expect(wordMarkRepositoryMock.save).toHaveBeenCalledWith(WORD_MARK_ENTITY);
			});

			it(`should call sourceService to check source and upsert with lemma mark if it needs`, async () => {
				await service.upsert(dto);

				expect(sourceServiceMock.getOrUpsert).toHaveBeenCalled();
			});

			it(`should increase count of lemma and word form mark`, async () => {
				await service.upsert(dto);

				expect(wordFormMarkRepositoryMock.update).toHaveBeenCalledWith(newLemmaMark.id, {
					count: newLemmaMark.count! + 1,
				});
				expect(wordMarkRepositoryMock.update).toHaveBeenCalledWith(WORD_MARK_ENTITY.id, {
					count: WORD_MARK_ENTITY.count! + 1,
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
			const dto: GetWordMarksDto = { workspaceId: WORKSPACE_ENTITY.id! };
			workspacesServiceMock.getOne.mockResolvedValue(WORKSPACE_ENTITY);
			wordMarkRepositoryMock.find.mockResolvedValue([WORD_MARK_ENTITY]);

			const result = await service.getMany(dto);

			expect(wordMarkRepositoryMock.find).toHaveBeenCalledWith({
				where: { workspace: WORKSPACE_ENTITY },
			});
			expect(result).toEqual([WORD_MARK_ENTITY]);
		});
	});

	describe('get one mark', () => {
		describe(`pass id of an existing mark`, () => {
			it('should return a mark by id', async () => {
				wordMarkRepositoryMock.findOne.mockResolvedValue(WORD_MARK_ENTITY);

				const result = await service.getOne(WORD_MARK_ENTITY.id!);

				expect(result).toEqual(WORD_MARK_ENTITY);
			});
		});

		describe(`pass id of a non-existing mark`, () => {
			it('should throw NotFoundException', async () => {
				wordMarkRepositoryMock.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
