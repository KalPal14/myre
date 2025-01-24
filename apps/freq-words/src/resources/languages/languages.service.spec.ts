import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { LanguagesService } from './languages.service';
import { Language } from './entities/language.entity';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from './stubs/languages';

type TRepositoryMock<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createRepositoryMock: <T = any>() => TRepositoryMock<T> = () => ({
	find: jest.fn(),
	findOne: jest.fn(),
});

describe('LanguagesService', () => {
	let service: LanguagesService;

	let languageRepository: TRepositoryMock;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LanguagesService,
				{
					provide: getRepositoryToken(Language),
					useValue: createRepositoryMock(),
				},
			],
		}).compile();

		service = module.get<LanguagesService>(LanguagesService);

		languageRepository = module.get<TRepositoryMock>(getRepositoryToken(Language));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('get many', () => {
		describe(`do not pass parameter q`, () => {
			it('should return all languages', async () => {
				languageRepository.find.mockResolvedValue([
					ENGLISH_LANGUAGE_ENTITY,
					RUSSIAN_LANGUAGE_ENTITY,
				]);

				const result = await service.getMany({});

				expect(languageRepository.find).toHaveBeenCalledWith({ where: undefined });
				expect(result).toEqual([ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY]);
			});
		});

		describe(`pass parameter q`, () => {
			it('should return filtered languages based on query', async () => {
				const q = 'Eng';
				languageRepository.find.mockResolvedValue([ENGLISH_LANGUAGE_ENTITY]);

				const result = await service.getMany({ q });

				expect(languageRepository.find).toHaveBeenCalledWith({
					where: { name: ILike(`%${q}%`) },
				});
				expect(result).toEqual([ENGLISH_LANGUAGE_ENTITY]);
			});
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing language`, () => {
			it('should return a language by id', async () => {
				languageRepository.findOne.mockResolvedValue(ENGLISH_LANGUAGE_ENTITY);

				const result = await service.getOne(1);

				expect(result).toEqual(ENGLISH_LANGUAGE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing language`, () => {
			it('should throw a NotFoundException if no language is found', async () => {
				languageRepository.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
