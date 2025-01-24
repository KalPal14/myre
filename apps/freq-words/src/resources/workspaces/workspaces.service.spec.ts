import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/freq-words';
import { JWT_PAYLOAD } from '~libs/common';

import { LanguagesService } from '../languages/languages.service';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../languages/stubs/languages';

import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { WORKSPACE_ENTITY } from './stubs/workspaces';

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

describe('WorkspacesService', () => {
	let service: WorkspacesService;

	let workspaceRepository: TRepositoryMock;
	let languagesService: LanguagesService;

	const languagesServiceMock = {
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WorkspacesService,
				{
					provide: getRepositoryToken(Workspace),
					useValue: createRepositoryMock(),
				},
				{
					provide: LanguagesService,
					useValue: languagesServiceMock,
				},
			],
		}).compile();

		service = module.get<WorkspacesService>(WorkspacesService);

		workspaceRepository = module.get<TRepositoryMock>(getRepositoryToken(Workspace));
		languagesService = module.get<LanguagesService>(LanguagesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('create', () => {
		const dto: CreateWorkspaceDto = {
			knownLanguageId: 1,
			targetLanguageId: 2,
			name: 'Test Workspace',
		};

		describe(`pass new workspace data`, () => {
			it('should create and save a new workspace', async () => {
				languagesService.getOne = jest.fn().mockResolvedValueOnce(ENGLISH_LANGUAGE_ENTITY);
				languagesService.getOne = jest.fn().mockResolvedValueOnce(RUSSIAN_LANGUAGE_ENTITY);
				workspaceRepository.findOne.mockResolvedValue(null);
				workspaceRepository.create.mockReturnValue(WORKSPACE_ENTITY);
				workspaceRepository.save.mockResolvedValue(WORKSPACE_ENTITY);

				const result = await service.create(JWT_PAYLOAD, dto);

				expect(result).toEqual(WORKSPACE_ENTITY);
			});
		});

		describe('pass data of already existing workspace', () => {
			it('should throw a BadRequestException', async () => {
				languagesService.getOne = jest.fn().mockResolvedValueOnce(ENGLISH_LANGUAGE_ENTITY);
				languagesService.getOne = jest.fn().mockResolvedValueOnce(RUSSIAN_LANGUAGE_ENTITY);
				workspaceRepository.findOne.mockResolvedValue(WORKSPACE_ENTITY);

				await expect(service.create(JWT_PAYLOAD, dto)).rejects.toThrow(BadRequestException);
			});
		});
	});

	describe('get many', () => {
		it(`should return all user's workspaces`, async () => {
			workspaceRepository.find.mockResolvedValue([WORKSPACE_ENTITY]);

			const result = await service.getMany(JWT_PAYLOAD);

			expect(result).toEqual([WORKSPACE_ENTITY]);
		});
	});

	describe('get one', () => {
		describe(`pass the id of an existing workspace`, () => {
			it('should return a workspace by id', async () => {
				workspaceRepository.findOne.mockResolvedValue(WORKSPACE_ENTITY);

				const result = await service.getOne(1);

				expect(result).toEqual(WORKSPACE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should throw a NotFoundException', async () => {
				workspaceRepository.findOne.mockResolvedValue(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('update', () => {
		const dto: UpdateWorkspaceDto = { name: 'Updated Workspace' };

		describe(`pass the id of an existing workspace`, () => {
			it('should update and return the workspace', async () => {
				workspaceRepository.preload.mockImplementation((workspace) => ({
					...WORKSPACE_ENTITY,
					...workspace,
				}));
				workspaceRepository.save.mockImplementation((workspace) => workspace);

				const result = await service.update(1, dto);

				expect(result).toEqual({ ...WORKSPACE_ENTITY, ...dto });
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should throw a NotFoundException', async () => {
				workspaceRepository.preload.mockResolvedValue(null);

				await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('delete', () => {
		describe(`pass the id of an existing workspace`, () => {
			it('should delete and return the workspace', async () => {
				workspaceRepository.findOne.mockResolvedValue(WORKSPACE_ENTITY);
				workspaceRepository.remove.mockImplementation((workspace) => {
					const { _id, ...workspaceData } = workspace;
					return workspaceData;
				});

				const result = await service.delete(1);

				expect(result).toEqual(WORKSPACE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should throw a NotFoundException', async () => {
				workspaceRepository.findOne.mockResolvedValue(null);

				await expect(service.delete(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
