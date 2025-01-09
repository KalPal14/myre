import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateWorkspaceDto, UpdateWorkspaceDto } from '~libs/dto/freq-words';
import { JWT_PAYLOAD, typeormRepositoryMock } from '~libs/common';

import { LanguagesService } from '../languages/languages.service';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../languages/mocks/languages';

import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { WORKSPACE_ENTITY } from './mocks/workspaces';

describe('WorkspacesService', () => {
	let service: WorkspacesService;

	const workspaceRepositoryMock = typeormRepositoryMock;

	const languagesServiceMock = {
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WorkspacesService,
				{
					provide: getRepositoryToken(Workspace),
					useValue: workspaceRepositoryMock,
				},
				{
					provide: LanguagesService,
					useValue: languagesServiceMock,
				},
			],
		}).compile();

		service = module.get<WorkspacesService>(WorkspacesService);
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
				languagesServiceMock.getOne.mockResolvedValueOnce(ENGLISH_LANGUAGE_ENTITY);
				languagesServiceMock.getOne.mockResolvedValueOnce(RUSSIAN_LANGUAGE_ENTITY);
				workspaceRepositoryMock.findOne.mockResolvedValueOnce(null);
				workspaceRepositoryMock.create.mockReturnValue(WORKSPACE_ENTITY);
				workspaceRepositoryMock.save.mockResolvedValueOnce(WORKSPACE_ENTITY);

				const result = await service.create(JWT_PAYLOAD, dto);

				expect(result).toEqual(WORKSPACE_ENTITY);
			});
		});

		describe('pass data of already existing workspace', () => {
			it('should throw a BadRequestException', async () => {
				languagesServiceMock.getOne.mockResolvedValueOnce(ENGLISH_LANGUAGE_ENTITY);
				languagesServiceMock.getOne.mockResolvedValueOnce(RUSSIAN_LANGUAGE_ENTITY);
				workspaceRepositoryMock.findOne.mockResolvedValueOnce(WORKSPACE_ENTITY);

				await expect(service.create(JWT_PAYLOAD, dto)).rejects.toThrow(BadRequestException);
			});
		});
	});

	describe('get many', () => {
		it('should return all workspaces for the user', async () => {
			workspaceRepositoryMock.find.mockResolvedValue([WORKSPACE_ENTITY]);

			const result = await service.getMany(JWT_PAYLOAD);

			expect(result).toEqual([WORKSPACE_ENTITY]);
		});
	});

	describe('get one', () => {
		describe(`pass the ID of an existing workspace`, () => {
			it('should return a workspace by ID', async () => {
				workspaceRepositoryMock.findOne.mockResolvedValue(WORKSPACE_ENTITY);

				const result = await service.getOne(1);

				expect(result).toEqual(WORKSPACE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should throw a NotFoundException', async () => {
				workspaceRepositoryMock.findOne.mockResolvedValueOnce(null);

				await expect(service.getOne(99)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('update', () => {
		const dto: UpdateWorkspaceDto = { name: 'Updated Workspace' };

		describe(`pass the ID of an existing workspace`, () => {
			it('should update and return the workspace', async () => {
				workspaceRepositoryMock.preload.mockImplementation((workspace) => ({
					...WORKSPACE_ENTITY,
					...workspace,
				}));
				workspaceRepositoryMock.save.mockImplementation((workspace) => workspace);

				const result = await service.update(1, dto);

				expect(result).toEqual({ ...WORKSPACE_ENTITY, ...dto });
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should throw a NotFoundException', async () => {
				workspaceRepositoryMock.preload.mockResolvedValueOnce(null);

				await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
			});
		});
	});

	describe('delete', () => {
		describe(`pass the ID of an existing workspace`, () => {
			it('should delete and return the workspace', async () => {
				workspaceRepositoryMock.findOne.mockResolvedValue(WORKSPACE_ENTITY);
				workspaceRepositoryMock.remove.mockImplementation((workspace) => {
					const { _id, ...workspaceData } = workspace;
					return workspaceData;
				});

				const result = await service.delete(1);

				expect(result).toEqual(WORKSPACE_ENTITY);
			});
		});

		describe(`pass the id of a non-existing workspace`, () => {
			it('should throw a NotFoundException', async () => {
				workspaceRepositoryMock.findOne.mockResolvedValueOnce(null);

				await expect(service.delete(99)).rejects.toThrow(NotFoundException);
			});
		});
	});
});
