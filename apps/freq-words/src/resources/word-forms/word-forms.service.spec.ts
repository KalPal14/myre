import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DefinitionDto } from '~libs/dto/freq-words/word-marks/common/definition.dto';

import { LanguagesService } from '../languages/languages.service';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../languages/stubs/languages';
import { Language } from '../languages/entities/language.entity';

import { Example } from './entities/example.entity';
import { WordFormsService } from './word-forms.service';
import { WordForm } from './entities/word-form.entity';
import { Definition } from './entities/definition.entity';
import { TRANSLATIONS_ENTITIES, WORD_FORM_ENTITY } from './stubs/word-forms';
import { DEFINITION_WORD_FORM_ENGLISH_ENTITY } from './stubs/definitions';
import { EXAMPLES_ENGLISH_WORD_FORM_ENTITIES } from './stubs/examples';

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

describe('WordFormsService', () => {
	let service: WordFormsService;

	let wordFormRepository: TRepositoryMock;
	let definitionRepository: TRepositoryMock;
	let exampleRepository: TRepositoryMock;

	let languagesService: LanguagesService;

	const languagesServiceMock = {
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WordFormsService,
				{ provide: getRepositoryToken(WordForm), useValue: createRepositoryMock() },
				{ provide: getRepositoryToken(Definition), useValue: createRepositoryMock() },
				{ provide: getRepositoryToken(Example), useValue: createRepositoryMock() },
				{ provide: LanguagesService, useValue: languagesServiceMock },
			],
		}).compile();

		service = module.get<WordFormsService>(WordFormsService);

		wordFormRepository = module.get<TRepositoryMock>(getRepositoryToken(WordForm));
		definitionRepository = module.get<TRepositoryMock>(getRepositoryToken(Definition));
		exampleRepository = module.get<TRepositoryMock>(getRepositoryToken(Example));

		languagesService = module.get<LanguagesService>(LanguagesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('get or create', () => {
		const data: Pick<WordForm, 'language' | 'name'> = {
			language: RUSSIAN_LANGUAGE_ENTITY as Language,
			name: WORD_FORM_ENTITY.name,
		};

		describe('pass data of new word form', () => {
			it('should create new word form and return it', async () => {
				wordFormRepository.findOneBy.mockResolvedValue(null);
				wordFormRepository.create.mockResolvedValue(WORD_FORM_ENTITY);
				wordFormRepository.save.mockImplementation((wordForm) => wordForm);

				const result = await service.getOrCreate(data);

				expect(result).toEqual(WORD_FORM_ENTITY);
			});
		});

		describe('pass data of existing word form', () => {
			it('should return existing word form', async () => {
				wordFormRepository.findOneBy.mockResolvedValue(WORD_FORM_ENTITY);

				const result = await service.getOrCreate(data);

				expect(result).toEqual(WORD_FORM_ENTITY);
			});
		});
	});

	describe('get or create defenition', () => {
		const definitionDto: DefinitionDto = {
			languageId: ENGLISH_LANGUAGE_ENTITY.id,
			examples: EXAMPLES_ENGLISH_WORD_FORM_ENTITIES.map(({ phrase }) => phrase),
			description: DEFINITION_WORD_FORM_ENGLISH_ENTITY.description,
			synonyms: TRANSLATIONS_ENTITIES.map(({ name }) => name),
		};

		describe('pass data of new definition', () => {
			it('should create new definition and return it', async () => {
				languagesService.getOne = jest.fn().mockResolvedValue(ENGLISH_LANGUAGE_ENTITY);
				definitionRepository.findOne.mockResolvedValue(null);
				exampleRepository.create.mockResolvedValue(EXAMPLES_ENGLISH_WORD_FORM_ENTITIES);
				wordFormRepository.findOneBy.mockImplementation(({ name }) =>
					TRANSLATIONS_ENTITIES.find((wordForm) => wordForm.name === name)
				);
				definitionRepository.create.mockImplementation((data) => ({
					id: DEFINITION_WORD_FORM_ENGLISH_ENTITY.id,
					...data,
				}));
				definitionRepository.save.mockImplementation((defenition) => defenition);

				const result = await service.getOrCreateDefinition(
					definitionDto,
					WORD_FORM_ENTITY as WordForm
				);

				expect(result).toEqual({
					...DEFINITION_WORD_FORM_ENGLISH_ENTITY,
					examples: EXAMPLES_ENGLISH_WORD_FORM_ENTITIES,
				});
			});
		});

		describe('pass data of existing defenition', () => {
			it('should return existing definition', async () => {
				languagesService.getOne = jest.fn().mockResolvedValue(ENGLISH_LANGUAGE_ENTITY);
				definitionRepository.findOne.mockResolvedValue(DEFINITION_WORD_FORM_ENGLISH_ENTITY);

				const result = await service.getOrCreateDefinition(
					definitionDto,
					WORD_FORM_ENTITY as WordForm
				);

				expect(result).toEqual(DEFINITION_WORD_FORM_ENGLISH_ENTITY);
			});
		});
	});
});
