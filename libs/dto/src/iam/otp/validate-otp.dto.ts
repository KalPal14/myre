import { IsEmail, IsNumberString, Length } from 'class-validator';

export class ValidateOtpDto {
	@IsEmail()
	email: string;

	@IsNumberString()
	@Length(6, 6)
	code: string;
}
