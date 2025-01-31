import { LoginDto, RegistrationDto, UpdateUserDto } from '~libs/dto/iam';
import { IJwtPayload } from '~libs/common/index';

import { UserModel } from '~/iam/prisma/client';

export interface IUsersService {
	get: (id: number) => Promise<UserModel>;
	create: (
		registerDto: RegistrationDto
	) => Promise<{ user: UserModel; testMailUrl: string | null }>;
	validate: (loginDto: LoginDto) => Promise<UserModel>;
	update: (user: IJwtPayload, updateDto: UpdateUserDto) => Promise<UserModel>;
}
