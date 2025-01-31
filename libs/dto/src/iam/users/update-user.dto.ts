import { Type } from 'class-transformer';
import { IsOptional, Matches, ValidateNested } from 'class-validator';

import { USERNAME } from '~libs/common/index';

import { ChangePasswordDto } from './common/change-password.dto';
import { UpdateViaOtp } from './common/update-requiring-otp.dto';

export class UpdateUserDto {
	@IsOptional()
	@Matches(USERNAME, {
		message:
			'Username can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	username?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => ChangePasswordDto)
	password?: ChangePasswordDto;

	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateViaOtp)
	updateViaOtp?: UpdateViaOtp;
}
