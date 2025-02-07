import { Type } from 'class-transformer';
import { IsEmail, IsOptional, Matches, ValidateNested } from 'class-validator';

import { USERNAME } from '~libs/common/index';

import { ChangePasswordDto } from './common/change-password.dto';

export class UpdateUserDto {
	@IsOptional()
	@Matches(USERNAME, {
		message:
			'Username can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	username?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => ChangePasswordDto)
	password?: ChangePasswordDto;
}
