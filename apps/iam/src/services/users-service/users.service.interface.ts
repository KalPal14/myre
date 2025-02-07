import { LoginDto, RegistrationDto, UpdateUserDto } from '~libs/dto/iam';
import { IJwtPayload } from '~libs/common/index';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	get: (id: number) => Promise<UserModel>;
	find: (data: Partial<UserModel>) => Promise<UserModel | null>;
	create: (registerDto: RegistrationDto) => Promise<UserModel>;
	validate: (loginDto: LoginDto) => Promise<UserModel>;
	update: (user: IJwtPayload, updateDto: UpdateUserDto) => Promise<UserModel>;
}
