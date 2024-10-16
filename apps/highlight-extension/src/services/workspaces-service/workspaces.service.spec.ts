import 'reflect-metadata';
import { Container } from 'inversify';

import { HTTPError } from '~libs/express-core';
import { UpdateWorkspaceDto } from '~libs/dto/highlight-extension';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { IWorkspacesRepository } from '~/highlight-extension/repositories/workspaces-repository/workspaces.repository.interface';
import { IWorkspaceFactory } from '~/highlight-extension/domain/workspace/factory/workspace-factory.interface';
import { WorkspaceFactory } from '~/highlight-extension/domain/workspace/factory/workspace.factory';
import { WorkspaceModel } from '~/highlight-extension/prisma/client';
import {
	CREATE_WORKSPACE_DTO,
	WORKSPACE,
	WORKSPACE_MODEL,
} from '~/highlight-extension/common/constants/spec/workspaces';

import { IWorkspacesService } from './workspaces.service.interface';
import { WorkspacesService } from './workspaces.service';

const workspacesRepositoryMock: IWorkspacesRepository = {
	findBy: jest.fn(),
	deepFindBy: jest.fn(),
	findManyBy: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

const container = new Container();
let workspacesService: IWorkspacesService;
let workspacesRepository: IWorkspacesRepository;

beforeAll(() => {
	container.bind<IWorkspacesService>(TYPES.WorkspacesService).to(WorkspacesService);
	container.bind<IWorkspaceFactory>(TYPES.WorkspaceFactory).to(WorkspaceFactory);
	container
		.bind<IWorkspacesRepository>(TYPES.WorkspacesRepository)
		.toConstantValue(workspacesRepositoryMock);

	workspacesService = container.get<IWorkspacesService>(TYPES.WorkspacesService);
	workspacesRepository = container.get<IWorkspacesRepository>(TYPES.WorkspacesRepository);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('UsersService', () => {
	describe('get workspace', () => {
		describe('pass the existing workspace ID ', () => {
			it('return workspace', async () => {
				workspacesRepository.deepFindBy = jest.fn().mockReturnValue(WORKSPACE_MODEL);

				const result = await workspacesService.get(1);

				expect(result).toEqual(WORKSPACE_MODEL);
			});
		});

		describe('pass the ID of a non-existing workspace', () => {
			it('throw an error', async () => {
				workspacesRepository.deepFindBy = jest.fn().mockReturnValue(null);

				try {
					await workspacesService.get(WORKSPACE_MODEL.id);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`highlight #${WORKSPACE_MODEL.id} not found`);
				}
			});
		});
	});

	describe('get all workspaces owned by the user', () => {
		it('return list of workspaces', async () => {
			const workspaces: WorkspaceModel[] = [WORKSPACE_MODEL, WORKSPACE_MODEL];
			workspacesRepository.findManyBy = jest.fn().mockReturnValue(workspaces);

			const result = await workspacesService.getAllOwners(1);

			expect(result).toBe(workspaces);
		});
	});

	describe('create workspace', () => {
		it('return workspace', async () => {
			workspacesRepository.create = jest
				.fn()
				.mockImplementation((workspace) => ({ id: WORKSPACE_MODEL.id, ...workspace }));

			const result = await workspacesService.create(WORKSPACE.ownerId, CREATE_WORKSPACE_DTO);

			expect(result).toEqual({
				id: WORKSPACE_MODEL.id,
				ownerId: WORKSPACE.ownerId,
				...CREATE_WORKSPACE_DTO,
			});
		});
	});

	describe('update workspace', () => {
		const DTO: UpdateWorkspaceDto = { name: 'new name', colors: ['#fff'] };

		describe('pass the existing workspace ID ', () => {
			it('return workspace', async () => {
				workspacesRepository.deepFindBy = jest.fn().mockReturnValue(WORKSPACE_MODEL);
				workspacesRepository.update = jest
					.fn()
					.mockImplementation((id, payload) => ({ ...WORKSPACE_MODEL, ...payload }));

				const result = await workspacesService.update(WORKSPACE_MODEL.id, DTO);

				expect(result).toEqual({ ...WORKSPACE_MODEL, ...DTO });
			});
		});

		describe('pass the ID of a non-existing workspace', () => {
			it('throw an error', async () => {
				workspacesRepository.deepFindBy = jest.fn().mockReturnValue(null);
				const updateSpy = jest.spyOn(workspacesRepository, 'update');

				try {
					await workspacesService.update(WORKSPACE_MODEL.id, DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`highlight #${WORKSPACE_MODEL.id} not found`);
					expect(updateSpy).not.toHaveBeenCalled();
				}
			});
		});
	});

	describe('delete workspace', () => {
		describe('pass the existing workspace ID ', () => {
			it('return workspace', async () => {
				workspacesRepository.deepFindBy = jest.fn().mockReturnValue(WORKSPACE_MODEL);
				workspacesRepository.delete = jest.fn().mockReturnValue(WORKSPACE_MODEL);

				const result = await workspacesService.delete(WORKSPACE_MODEL.id);

				expect(result).toEqual(WORKSPACE_MODEL);
			});
		});

		describe('pass the ID of a non-existing workspace', () => {
			it('throw an error', async () => {
				workspacesRepository.deepFindBy = jest.fn().mockReturnValue(null);
				const deleteSpy = jest.spyOn(workspacesRepository, 'delete');

				try {
					await workspacesService.delete(WORKSPACE_MODEL.id);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe(`highlight #${WORKSPACE_MODEL.id} not found`);
					expect(deleteSpy).not.toHaveBeenCalled();
				}
			});
		});
	});
});
