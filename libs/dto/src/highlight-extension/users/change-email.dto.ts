import { IsEmail } from 'class-validator';

export class ChangeEmailDto {
	@IsEmail({}, { message: 'Enter a valid email' })
	newEmail: string;
}
