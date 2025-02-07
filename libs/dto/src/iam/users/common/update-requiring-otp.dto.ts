import { IsBoolean, IsEmail, IsNumberString, IsOptional, Length } from 'class-validator';

export class UpdateViaOtp {
	@IsNumberString()
	@Length(6, 6)
	code: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsBoolean()
	verified?: boolean;
}
