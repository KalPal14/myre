import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { GetOrCreateSourceDto, GetSourcesDto, UpdateSourceDto } from '~libs/dto/freq-words';

import { WorkspacesService } from '../workspaces/workspaces.service';
import { WordFormMark } from '../word-marks/entities/word-form-mark.entity';
import { WORKSPACE_ENTITY } from '../workspaces/mocks/workspaces';
import { WORD_FORM_MARK_ENTITY } from '../word-marks/mocks/word-form-marks';

import { SourceService } from './source.service';
import { Source } from './entities/source.entity';
import { SOURCE_ENTITY } from './mocks/sources';

describe('SourceService', () => {
	let service: SourceService;

	const sourceRepositoryMock = {
		find: jest.fn(),
		findOne: jest.fn(),
		save: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		preload: jest.fn(),
		remove: jest.fn(),
	};

	const workspacesServiceMock = {
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SourceService,
				{
					provide: getRepositoryToken(Source),
					useValue: sourceRepositoryMock,
				},
				{
					provide: WorkspacesService,
					useValue: workspacesServiceMock,
				},
			],
		}).compile();

		service = module.get<SourceService>(SourceService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('get or create', () => {
		const dto: GetOrCreateSourceDto = {
			link: SOURCE_ENTITY.link!,
			workspaceId: WORKSPACE_ENTITY.id!,
		};

		describe(`pass data of an existing source`, () => {
			it('should return an existing source', async () => {
				workspacesServiceMock.getOne.mockResolvedValue(WORKSPACE_ENTITY);
				sourceRepositoryMock.findOne.mockResolvedValue(SOURCE_ENTITY);

				const result = await service.getOrCreate(dto);

				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass data of non-existing source`, () => {
			it('should create and save a new source', async () => {
				workspacesServiceMock.getOne.mockResolvedValue(WORKSPACE_ENTITY);
				sourceRepositoryMock.findOne.mockResolvedValue(null);
				sourceRepositoryMock.create.mockReturnValue(SOURCE_ENTITY);
				sourceRepositoryMock.save.mockImplementation((source) => source);

				const result = await service.getOrCreate(dto);

				expect(sourceRepositoryMock.create).toHaveBeenCalledWith({
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

				sourceRepositoryMock.findOne
					.mockResolvedValueOnce(SOURCE_ENTITY)
					.mockResolvedValueOnce(SOURCE_ENTITY);

				const result = await service.getOrUpsert({
					link: SOURCE_ENTITY.link!,
					workspaceId: WORKSPACE_ENTITY.id!,
					wordFormMark,
				});

				expect(sourceRepositoryMock.save).not.toHaveBeenCalled();
				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass data for existing source and wordFormMark that is not in this source`, () => {
			it('should add a new wordFormMark to the source', async () => {
				const wordFormMark: WordFormMark = WORD_FORM_MARK_ENTITY as WordFormMark;
				sourceRepositoryMock.findOne
					.mockResolvedValueOnce({ ...SOURCE_ENTITY, wordFormMarks: [] })
					.mockResolvedValue(null);
				sourceRepositoryMock.save.mockImplementation((source) => source);

				const result = await service.getOrUpsert({
					link: SOURCE_ENTITY.link!,
					workspaceId: WORKSPACE_ENTITY.id!,
					wordFormMark,
				});

				expect(result).toEqual({ ...SOURCE_ENTITY, wordFormMarks: [wordFormMark] });
			});
		});
	});

	describe('get many', () => {
		it('should return all sources for a workspace', async () => {
			workspacesServiceMock.getOne.mockResolvedValue(WORKSPACE_ENTITY);
			sourceRepositoryMock.find.mockResolvedValue([SOURCE_ENTITY]);

			const dto: GetSourcesDto = { workspaceId: WORKSPACE_ENTITY.id! };
			const result = await service.getMany(dto);

			expect(sourceRepositoryMock.find).toHaveBeenCalledWith({
				where: { workspace: WORKSPACE_ENTITY },
			});
			expect(result).toEqual([SOURCE_ENTITY]);
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing source`, () => {
			it('should return a source by id', async () => {
				sourceRepositoryMock.findOne.mockResolvedValue(SOURCE_ENTITY);

				const result = await service.getOne(1);

				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should throw NotFoundException', async () => {
				sourceRepositoryMock.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('update', () => {
		describe(`pass the id of an existing source`, () => {
			it('should update and return the source', async () => {
				const dto: UpdateSourceDto = { link: 'https://updated.link' };

				sourceRepositoryMock.findOne.mockResolvedValue(SOURCE_ENTITY);
				sourceRepositoryMock.save.mockImplementation((source) => source);

				const result = await service.update(1, dto);

				expect(result).toEqual({ ...SOURCE_ENTITY, ...dto });
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should throw NotFoundException', async () => {
				sourceRepositoryMock.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('delete', () => {
		describe(`pass the id of an existing source`, () => {
			it('should delete and return the source', async () => {
				sourceRepositoryMock.findOne.mockResolvedValue(SOURCE_ENTITY);
				sourceRepositoryMock.remove.mockImplementation((source) => source);

				const result = await service.delete(1);

				expect(result).toEqual(SOURCE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing source`, () => {
			it('should throw NotFoundException', async () => {
				sourceRepositoryMock.findOne.mockResolvedValue(null);

				await expect(service.delete(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
