import { IsBoolean, IsEmail, IsOptional, Max, Min } from 'class-validator';

export class UpdateViaOtp {
	@Min(100000, { message: 'code must contain a 6-digit number' })
	@Max(999999, { message: 'code must contain a 6-digit number' })
	code: number;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsBoolean()
	verified?: boolean;
}
