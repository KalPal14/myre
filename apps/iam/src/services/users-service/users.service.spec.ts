import 'reflect-metadata';
import { Container } from 'inversify';
import bcryptjs from 'bcryptjs';

import { api, generateJwt } from '~libs/common';
import { HTTPError, IConfigService } from '~libs/express-core';
import { ChangeEmailDto, ChangePasswordDto, ChangeUsernameDto, LoginDto } from '~libs/dto/iam';
import { JWT_PAYLOAD } from '~libs/common/index';
import { WORKSPACES_FULL_URLS } from '~libs/routes/highlight-extension';

import { UserModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { User } from '~/iam/domain/user/user';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';
import { UserFactory } from '~/iam/domain/user/factory/user.factory';
import {
	CREATE_USER_DTO,
	LOGIN_USER_DTO,
	USER,
	USER_MODEL,
} from '~/iam/common/constants/spec/users';
import { prismaServiceMock } from '~/iam/common/mocks/prisma.service.mock';

import { IUsersService } from './users.service.interface';
import { UsersService } from './users.service';

const usersRepositoryMock: IUsersRepository = {
	findBy: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
};

const configServiceMock: IConfigService = {
	get: jest.fn(),
};

jest.mock('~libs/common', () => ({
	...jest.requireActual('~libs/common'),
	generateJwt: jest.fn(),
	api: {
		post: jest.fn(),
	},
}));

const container = new Container();
let usersService: IUsersService;
let usersRepository: IUsersRepository;
let configService: IConfigService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IUserFactory>(TYPES.UserFactory).to(UserFactory);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(usersRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
	container.bind<typeof prismaServiceMock>(TYPES.PrismaService).toConstantValue(prismaServiceMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	configService = container.get<IConfigService>(TYPES.ConfigService);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('UsersService', () => {
	describe('registartion', () => {
		const CREATE_DTO = CREATE_USER_DTO();

		describe('pass new email and username', () => {
			it('return created user and workspace', async () => {
				const mockJwtKey = 'mock-jwt-key';
				const mockJwt = 'mock-jwt-token';
				const mockWorkspaceResponse = { id: 1, name: `${CREATE_DTO.username}'s workspace` };
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(null);
				prismaServiceMock.client.userModel.create.mockImplementation(
					(user: { data: User }): UserModel => ({
						id: USER_MODEL.id,
						...user.data,
					})
				);
				configService.get = jest.fn().mockReturnValue(mockJwtKey);
				(generateJwt as jest.Mock).mockResolvedValue(mockJwt);
				(api.post as jest.Mock).mockResolvedValue(mockWorkspaceResponse);
				const hashSpy = jest.spyOn(bcryptjs, 'hash');

				const result = await usersService.create(CREATE_DTO);
				const hashSpyResult = await hashSpy.mock.results[0].value;

				expect(result).toEqual({
					user: {
						...USER_MODEL,
						password: hashSpyResult,
						email: CREATE_DTO.email,
						username: CREATE_DTO.username,
					},
					workspace: mockWorkspaceResponse,
				});
				expect(generateJwt).toHaveBeenCalledWith(
					{ id: USER_MODEL.id, email: CREATE_DTO.email, username: CREATE_DTO.username },
					mockJwtKey
				);
				expect(api.post).toHaveBeenCalledWith(
					WORKSPACES_FULL_URLS.create,
					{
						name: `${CREATE_DTO.username}'s workspace`,
						colors: [],
					},
					{ headers: { Authorization: `Bearer ${mockJwt}` } }
				);
			});
		});

		describe('pass existing email', () => {
			it('throw error', async () => {
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);

				try {
					await usersService.create(CREATE_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('user with this email already exists');
				}
			});
		});

		describe('pass existing username', () => {
			it('throw error', async () => {
				usersRepositoryMock.findBy = jest
					.fn()
					.mockReturnValueOnce(null)
					.mockReturnValueOnce(USER_MODEL);

				try {
					await usersService.create(CREATE_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('user with this username already exists');
				}
			});
		});
	});

	describe('login', () => {
		describe('login by email', () => {
			const LOGIN_DTO: LoginDto = {
				userIdentifier: USER.email,
				password: USER.password,
			};

			describe('pass correct email and password', () => {
				it('return user', async () => {
					usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);
					const findBySpy = jest.spyOn(usersRepository, 'findBy');

					const result = await usersService.validate(LOGIN_DTO);

					expect(findBySpy).toHaveBeenCalledWith({ email: LOGIN_DTO.userIdentifier });
					expect(result).toBe(USER_MODEL);
				});
			});

			describe('pass incorrect email', () => {
				it('throw error', async () => {
					usersRepositoryMock.findBy = jest.fn().mockReturnValue(null);

					try {
						await usersService.validate(LOGIN_DTO);
					} catch (err: any) {
						expect(err).toBeInstanceOf(HTTPError);
						expect(err.message).toBe('There is no user with this email');
					}
				});
			});
		});

		describe('login by username', () => {
			describe('pass correct username and password', () => {
				it('validate user - success: by username', async () => {
					usersRepository.findBy = jest.fn().mockReturnValue(USER_MODEL);
					const findBySpy = jest.spyOn(usersRepository, 'findBy');

					const result = await usersService.validate(LOGIN_USER_DTO);

					expect(findBySpy).toHaveBeenCalledWith({ username: LOGIN_USER_DTO.userIdentifier });
					expect(result).toBe(USER_MODEL);
				});
			});

			describe('pass incorrect username', () => {
				it('throw error', async () => {
					usersRepositoryMock.findBy = jest.fn().mockReturnValue(null);

					try {
						await usersService.validate(LOGIN_USER_DTO);
					} catch (err: any) {
						expect(err).toBeInstanceOf(HTTPError);
						expect(err.message).toBe('There is no user with this username');
					}
				});
			});
		});

		describe('pass incorect password', () => {
			it('throw error', async () => {
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);

				try {
					await usersService.validate(LOGIN_USER_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('Incorrect password');
				}
			});
		});
	});

	describe('change password', () => {
		describe('pass correct current and new passwords', () => {
			it('return updated user', async () => {
				const CHANGE_PASSWORD_DTO: ChangePasswordDto = {
					newPassword: '123123123',
					password: USER.password,
				};
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);
				usersRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<User>): UserModel => ({
						...USER_MODEL,
						id,
						...payload,
					})
				);
				const hashSpy = jest.spyOn(bcryptjs, 'hash');
				const userRepoUpdateSpy = jest.spyOn(usersRepository, 'update');

				const result = await usersService.changePassword(JWT_PAYLOAD, CHANGE_PASSWORD_DTO);

				const hashSpyResult = await hashSpy.mock.results[1].value;
				const { passwordUpdatedAt } = userRepoUpdateSpy.mock.calls[0][1];
				expect(result).toEqual({
					...USER_MODEL,
					password: hashSpyResult,
					passwordUpdatedAt: passwordUpdatedAt,
				});
			});
		});

		describe('pass new password the same as current', () => {
			it('throw error', async () => {
				const CHANGE_PASSWORD_DTO: ChangePasswordDto = {
					password: USER.password,
					newPassword: USER.password,
				};
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);

				try {
					await usersService.changePassword(JWT_PAYLOAD, CHANGE_PASSWORD_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('new password cannot be the same as the old one');
				}
			});
		});

		describe('pass incorrect current password', () => {
			it('throw error', async () => {
				const CHANGE_PASSWORD_DTO: ChangePasswordDto = {
					password: 'wrong password',
					newPassword: '123123123',
				};
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);
				usersRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<User>): UserModel => ({
						...USER_MODEL,
						id,
						...payload,
					})
				);

				try {
					await usersService.changePassword(JWT_PAYLOAD, CHANGE_PASSWORD_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('Incorrect password');
				}
			});
		});
	});

	describe('change email', () => {
		const CHANGE_EMAIL_DTO: ChangeEmailDto = {
			newEmail: 'new@gmail.com',
		};

		describe('pass correct current and new emails', () => {
			it('return updated user', async () => {
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(null);
				usersRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<User>): UserModel => ({
						...USER_MODEL,
						id,
						...payload,
					})
				);

				const result = await usersService.changeEmail(JWT_PAYLOAD, CHANGE_EMAIL_DTO);

				expect(result).toEqual({ ...USER_MODEL, email: CHANGE_EMAIL_DTO.newEmail });
			});
		});

		describe('pass new email the same as current', () => {
			it('throw error', async () => {
				const CHANGE_EMAIL_DTO: ChangeEmailDto = {
					newEmail: JWT_PAYLOAD.email,
				};

				try {
					await usersService.changeEmail(JWT_PAYLOAD, CHANGE_EMAIL_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('new email cannot be the same as the old one');
				}
			});
		});

		describe('pass an existing new email', () => {
			it('throw error', async () => {
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);

				try {
					await usersService.changeEmail(JWT_PAYLOAD, CHANGE_EMAIL_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('account with this email already exists');
				}
			});
		});
	});

	describe('change username', () => {
		const CHANGE_USERNAME_DTO: ChangeUsernameDto = {
			newUsername: 'new_name-new_life',
		};

		describe('pass correct current and new usernames', () => {
			it('return updated user', async () => {
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(null);
				usersRepository.update = jest.fn().mockImplementation(
					(id: number, payload: Partial<User>): UserModel => ({
						...USER_MODEL,
						id,
						...payload,
					})
				);

				const result = await usersService.changeUsername(JWT_PAYLOAD, CHANGE_USERNAME_DTO);

				expect(result).toEqual({ ...USER_MODEL, username: CHANGE_USERNAME_DTO.newUsername });
			});
		});

		describe('pass new username the same as current', () => {
			it('throw error', async () => {
				const CHANGE_USERNAME_DTO: ChangeUsernameDto = {
					newUsername: JWT_PAYLOAD.username,
				};

				try {
					await usersService.changeUsername(JWT_PAYLOAD, CHANGE_USERNAME_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('new username cannot be the same as the old one');
				}
			});
		});

		describe('pass an existing new username', () => {
			it('throw error', async () => {
				usersRepositoryMock.findBy = jest.fn().mockReturnValue(USER_MODEL);

				try {
					await usersService.changeUsername(JWT_PAYLOAD, CHANGE_USERNAME_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('account with this username already exists');
				}
			});
		});
	});
});
