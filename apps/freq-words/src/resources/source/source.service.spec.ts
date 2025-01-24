import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetOrCreateSourceDto, GetSourcesDto, UpdateSourceDto } from '~libs/dto/freq-words';

import { WorkspacesService } from '../workspaces/workspaces.service';
import { WordFormMark } from '../word-marks/entities/word-form-mark.entity';
import { WORKSPACE_ENTITY } from '../workspaces/stubs/workspaces';
import { WORD_FORM_MARK_ENTITY } from '../word-marks/stubs/word-form-marks';

import { SourceService } from './source.service';
import { Source } from './entities/source.entity';
import { SOURCE_ENTITY } from './stubs/sources';

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

describe('SourceService', () => {
	let service: SourceService;

	let sourceRepository: TRepositoryMock;
	let workspacesService: WorkspacesService;

	const workspacesServiceMock = {
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SourceService,
				{
					provide: getRepositoryToken(Source),
					useValue: createRepositoryMock(),
				},
				{
					provide: WorkspacesService,
					useValue: workspacesServiceMock,
				},
			],
		}).compile();

		service = module.get<SourceService>(SourceService);

		sourceRepository = module.get<TRepositoryMock>(getRepositoryToken(Source));
		workspacesService = module.get<WorkspacesService>(WorkspacesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('get or create', () => {
		const dto: GetOrCreateSourceDto = {
			link: SOURCE_ENTITY.link,
			workspaceId: WORKSPACE_ENTITY.id,
		};

		describe(`pass data of an existing source`, () => {
			it('should return an existing source', async () => {
				workspacesService.getOne = jest.fn().mockResolvedValue(WORKSPACE_ENTITY);
				sourceRepository.findOne.mockResolvedValue(SOURCE_ENTITY);

				const result = await service.getOrCreate(dto);

				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass data of non-existing source`, () => {
			it('should create and save a new source', async () => {
				workspacesService.getOne = jest.fn().mockResolvedValue(WORKSPACE_ENTITY);
				sourceRepository.findOne.mockResolvedValue(null);
				sourceRepository.create.mockReturnValue(SOURCE_ENTITY);
				sourceRepository.save.mockImplementation((source) => source);

				const result = await service.getOrCreate(dto);

				expect(sourceRepository.create).toHaveBeenCalledWith({
					link: dto.link,
					workspace: WORKSPACE_ENTITY,
					wordFormMarks: [],
				});
				expect(result).toEqual(SOURCE_ENTITY);
			});
		});
	});

	describe('get or upsert', () => {
		describe(`pass data that does not require updating the source`, () => {
			it('must return an existing source unchanged', async () => {
				const wordFormMark: WordFormMark = WORD_FORM_MARK_ENTITY as WordFormMark;

				sourceRepository.findOne
					.mockResolvedValueOnce(SOURCE_ENTITY)
					.mockResolvedValueOnce(SOURCE_ENTITY);

				const result = await service.getOrUpsert({
					link: SOURCE_ENTITY.link,
					workspaceId: WORKSPACE_ENTITY.id,
					wordFormMark,
				});

				expect(sourceRepository.save).not.toHaveBeenCalled();
				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass data for existing source and wordFormMark that is not in this source`, () => {
			it('should add a new wordFormMark to the source', async () => {
				const wordFormMark: WordFormMark = WORD_FORM_MARK_ENTITY as WordFormMark;
				sourceRepository.findOne
					.mockResolvedValueOnce({ ...SOURCE_ENTITY, wordFormMarks: [] })
					.mockResolvedValue(null);
				sourceRepository.save.mockImplementation((source) => source);

				const result = await service.getOrUpsert({
					link: SOURCE_ENTITY.link,
					workspaceId: WORKSPACE_ENTITY.id,
					wordFormMark,
				});

				expect(result).toEqual({ ...SOURCE_ENTITY, wordFormMarks: [wordFormMark] });
			});
		});
	});

	describe('get many', () => {
		it('should return all sources for a workspace', async () => {
			workspacesService.getOne = jest.fn().mockResolvedValue(WORKSPACE_ENTITY);
			sourceRepository.find.mockResolvedValue([SOURCE_ENTITY]);

			const dto: GetSourcesDto = { workspaceId: WORKSPACE_ENTITY.id };
			const result = await service.getMany(dto);

			expect(sourceRepository.find).toHaveBeenCalledWith({
				where: { workspace: WORKSPACE_ENTITY },
			});
			expect(result).toEqual([SOURCE_ENTITY]);
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing source`, () => {
			it('should return a source by id', async () => {
				sourceRepository.findOne.mockResolvedValue(SOURCE_ENTITY);

				const result = await service.getOne(1);

				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should throw NotFoundException', async () => {
				sourceRepository.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('update', () => {
		describe(`pass the id of an existing source`, () => {
			it('should update and return the source', async () => {
				const dto: UpdateSourceDto = { link: 'https://updated.link' };

				sourceRepository.findOne.mockResolvedValue(SOURCE_ENTITY);
				sourceRepository.save.mockImplementation((source) => source);

				const result = await service.update(1, dto);

				expect(result).toEqual({ ...SOURCE_ENTITY, ...dto });
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should throw NotFoundException', async () => {
				sourceRepository.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('delete', () => {
		describe(`pass the id of an existing source`, () => {
			it('should delete and return the source', async () => {
				sourceRepository.findOne.mockResolvedValue(SOURCE_ENTITY);
				sourceRepository.remove.mockImplementation((source) => source);

				const result = await service.delete(1);

				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should throw NotFoundException', async () => {
				sourceRepository.findOne.mockResolvedValue(null);

				await expect(service.delete(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
