import { IsEmail, Max, Min } from 'class-validator';

export class ValidateOtpDto {
	@IsEmail()
	email: string;

	@Min(100000, { message: 'code must contain a 6-digit number' })
	@Max(999999, { message: 'code must contain a 6-digit number' })
	code: number;
}
