import { IsEmail } from 'class-validator';

export class UpsertOtpDto {
	@IsEmail()
	email: string;
}
