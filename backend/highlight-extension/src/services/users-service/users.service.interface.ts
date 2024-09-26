import { UserModel } from '@prisma/client';

import { IJwtPayload } from '@/common/types/jwt-payload.interface';
import { ChangeEmailDto } from '@/dto/users/change-email.dto';
import { ChangePasswordDto } from '@/dto/users/change-password.dto';
import { ChangeUsernameDto } from '@/dto/users/change-username.dto';
import { UpdateUserDto } from '@/dto/users/update-user.dto';
import { UsersLoginDto } from '@/dto/users/users-login.dto';
import { UsersRegisterDto } from '@/dto/users/users-register.dto';

export interface IUsersService {
	createUser: (user: UsersRegisterDto) => Promise<UserModel | Error>;
	validateUser: (user: UsersLoginDto) => Promise<UserModel | Error>;
	updateUser: (id: number, payload: UpdateUserDto) => Promise<UserModel>;

	getUserInfo: (id: number) => Promise<UserModel | null>;

	changePassword: (user: IJwtPayload, payload: ChangePasswordDto) => Promise<UserModel | Error>;
	changeEmail: (user: IJwtPayload, payload: ChangeEmailDto) => Promise<UserModel | Error>;
	changeUsername: (user: IJwtPayload, payload: ChangeUsernameDto) => Promise<UserModel | Error>;
}
