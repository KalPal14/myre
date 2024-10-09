import { MinLength } from 'class-validator';

export class ChangePasswordDto {
	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	password: string;

	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	newPassword: string;
}
