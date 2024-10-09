import { IsEmail, Matches, MinLength } from 'class-validator';

import { USERNAME } from '~libs/common';

export class UsersRegisterDto {
	@IsEmail({}, { message: 'Enter a valid email' })
	email: string;

	@Matches(USERNAME, {
		message:
			'The username field must contain only uppercase and lowercase letters, as well as the symbols - and _.',
	})
	username: string;

	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	password: string;
}
