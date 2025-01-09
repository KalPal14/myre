import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike } from 'typeorm';

import { typeormRepositoryMock } from '~libs/common';

import { LanguagesService } from './languages.service';
import { Language } from './entities/language.entity';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from './mocks/languages';

describe('LanguagesService', () => {
	let service: LanguagesService;

	const languageRepositoryMock = typeormRepositoryMock;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LanguagesService,
				{
					provide: getRepositoryToken(Language),
					useValue: languageRepositoryMock,
				},
			],
		}).compile();

		service = module.get<LanguagesService>(LanguagesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('get many', () => {
		describe(`do not pass parameter q`, () => {
			it('should return all languages', async () => {
				languageRepositoryMock.find.mockResolvedValue([
					ENGLISH_LANGUAGE_ENTITY,
					RUSSIAN_LANGUAGE_ENTITY,
				]);

				const result = await service.getMany({});

				expect(languageRepositoryMock.find).toHaveBeenCalledWith({ where: undefined });
				expect(result).toEqual([ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY]);
			});
		});

		describe(`pass parameter q`, () => {
			it('should return filtered languages based on query', async () => {
				const q = 'Eng';
				languageRepositoryMock.find.mockResolvedValue([ENGLISH_LANGUAGE_ENTITY]);

				const result = await service.getMany({ q });

				expect(languageRepositoryMock.find).toHaveBeenCalledWith({
					where: { name: ILike(`%${q}%`) },
				});
				expect(result).toEqual([ENGLISH_LANGUAGE_ENTITY]);
			});
		});
	});

	describe('get one', () => {
		describe(`pass the ID of an existing language`, () => {
			it('should return a language by ID', async () => {
				languageRepositoryMock.findOne.mockResolvedValue(ENGLISH_LANGUAGE_ENTITY);

				const result = await service.getOne(1);

				expect(languageRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
				expect(result).toEqual(ENGLISH_LANGUAGE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing language`, () => {
			it('should throw a NotFoundException if no language is found', async () => {
				languageRepositoryMock.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
				expect(languageRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
			});
		});
	});
});
