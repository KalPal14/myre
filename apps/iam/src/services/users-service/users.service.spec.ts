import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { HTTPError } from '~libs/common';
import { LoginDto, UpdateUserDto } from '~libs/dto/iam';
import { JWT_PAYLOAD } from '~libs/common/index';

import { TYPES } from '~/iam/common/constants/types';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { User } from '~/iam/domain/user/user';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';
import { CREATE_USER_DTO, LOGIN_USER_DTO, USER, USER_MODEL } from '~/iam/common/stubs/users';

import { IUsersService } from './users.service.interface';
import { UsersService } from './users.service';

const usersRepositoryMock: IUsersRepository = {
	findBy: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
};

const userFactoryMock: IUserFactory = {
	create: jest.fn(),
	createWithHashPassword: jest.fn(),
};

jest.mock('~libs/common', () => ({
	...jest.requireActual('~libs/common'),
	api: {
		post: jest.fn(),
	},
}));

const container = new Container();
let usersService: IUsersService;
let userFactory: IUserFactory;
let usersRepository: IUsersRepository;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IUserFactory>(TYPES.UserFactory).toConstantValue(userFactoryMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(usersRepositoryMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	userFactory = container.get<IUserFactory>(TYPES.UserFactory);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('UsersService', () => {
	describe('registartion', () => {
		const CREATE_DTO = CREATE_USER_DTO();

		describe('pass new email and username', () => {
			it('return created user', async () => {
				userFactory.create = jest.fn().mockReturnValue({ ...USER, password: USER_MODEL.password });
				usersRepository.create = jest.fn().mockImplementation((data) => ({
					...data,
					id: USER_MODEL.id,
				}));

				const result = await usersService.create(CREATE_DTO);

				expect(result).toEqual(USER_MODEL);
			});
		});

		describe('pass existing email or username', () => {
			it('throw error', async () => {
				userFactory.create = jest.fn().mockReturnValue({ ...USER, password: USER_MODEL.password });
				usersRepository.create = jest.fn().mockImplementation(() => {
					throw new PrismaClientKnownRequestError('', {
						clientVersion: '0',
						code: 'P2002',
						meta: { target: ['email'] },
					});
				});

				try {
					await usersService.create(CREATE_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('User with this email already exists');
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
					userFactory.createWithHashPassword = jest.fn().mockReturnValue({
						...USER,
						password: USER_MODEL.password,
						comperePassword: jest.fn().mockReturnValue(true),
					});

					const result = await usersService.validate(LOGIN_DTO);

					expect(usersRepository.findBy).toHaveBeenCalledWith({ email: LOGIN_DTO.userIdentifier });
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
					userFactory.createWithHashPassword = jest.fn().mockReturnValue({
						...USER,
						password: USER_MODEL.password,
						comperePassword: jest.fn().mockReturnValue(true),
					});

					const result = await usersService.validate(LOGIN_USER_DTO);

					expect(usersRepository.findBy).toHaveBeenCalledWith({
						username: LOGIN_USER_DTO.userIdentifier,
					});
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
				userFactory.createWithHashPassword = jest.fn().mockReturnValue({
					...USER,
					password: USER_MODEL.password,
					comperePassword: jest.fn().mockReturnValue(false),
				});

				try {
					await usersService.validate(LOGIN_USER_DTO);
				} catch (err: any) {
					expect(err).toBeInstanceOf(HTTPError);
					expect(err.message).toBe('Incorrect password');
				}
			});
		});
	});

	describe('update', () => {
		beforeEach(() => {
			usersRepository.update = jest
				.fn()
				.mockImplementation((id: number, payload: Partial<User>) => {
					const fileredPayload = Object.fromEntries(
						Object.entries(payload).filter((entry) => entry[1])
					);
					return {
						...USER_MODEL,
						...fileredPayload,
					};
				});
		});

		describe('change password', () => {
			const dto: UpdateUserDto = {
				password: {
					newPassword: '123123123',
					currentPassword: USER.password,
				},
			};

			describe('pass correct current and new passwords', () => {
				it('return updated user', async () => {
					usersRepository.findBy = jest.fn().mockReturnValue(USER_MODEL);
					userFactory.createWithHashPassword = jest.fn().mockReturnValue({
						...USER,
						password: USER_MODEL.password,
						comperePassword: jest.fn().mockReturnValue(true),
					});

					userFactory.create = jest
						.fn()
						.mockResolvedValue({ ...USER_MODEL, password: dto.password?.newPassword });

					const result = await usersService.update(JWT_PAYLOAD, dto);

					expect(result.password).toBe(dto.password?.newPassword);
					expect(result.passwordUpdatedAt).not.toBe(null);
				});
			});

			describe('pass incorrect current password', () => {
				it('throw error', async () => {
					usersRepository.findBy = jest.fn().mockReturnValue(USER_MODEL);
					userFactory.createWithHashPassword = jest.fn().mockReturnValue({
						...USER,
						password: USER_MODEL.password,
						comperePassword: jest.fn().mockReturnValue(false),
					});

					try {
						await usersService.update(JWT_PAYLOAD, dto);
					} catch (err: any) {
						expect(err).toBeInstanceOf(HTTPError);
						expect(err.message).toBe('Incorrect password');
					}
				});
			});
		});

		describe('change email', () => {
			const dto: UpdateUserDto = {
				email: 'updated@test.com',
			};

			describe('pass correct email', () => {
				it('return updated user', async () => {
					const result = await usersService.update(JWT_PAYLOAD, dto);

					expect(result).toEqual({ ...USER_MODEL, email: dto.email });
				});
			});

			describe('pass an existing email', () => {
				it('throw error', async () => {
					usersRepository.update = jest.fn().mockImplementation(() => {
						throw new PrismaClientKnownRequestError('', {
							clientVersion: '0',
							code: 'P2002',
							meta: { target: ['email'] },
						});
					});

					try {
						await usersService.update(JWT_PAYLOAD, dto);
					} catch (err: any) {
						expect(err).toBeInstanceOf(HTTPError);
						expect(err.message).toBe('User with this email already exists');
					}
				});
			});
		});

		describe('change username', () => {
			const CHANGE_USERNAME_DTO: UpdateUserDto = {
				username: 'new_name-new_life',
			};

			describe('pass correct current and new usernames', () => {
				it('return updated user', async () => {
					const result = await usersService.update(JWT_PAYLOAD, CHANGE_USERNAME_DTO);

					expect(result).toEqual({ ...USER_MODEL, username: CHANGE_USERNAME_DTO.username });
				});
			});

			describe('pass an existing new username', () => {
				it('throw error', async () => {
					usersRepository.update = jest.fn().mockImplementation(() => {
						throw new PrismaClientKnownRequestError('', {
							clientVersion: '0',
							code: 'P2002',
							meta: { target: ['username'] },
						});
					});

					try {
						await usersService.update(JWT_PAYLOAD, CHANGE_USERNAME_DTO);
					} catch (err: any) {
						expect(err).toBeInstanceOf(HTTPError);
						expect(err.message).toBe('User with this username already exists');
					}
				});
			});
		});
	});
});
