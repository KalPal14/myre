import { MinLength, Validate } from 'class-validator';

import { IsUserIdentifier } from '~libs/common';

export class LoginDto {
	@Validate(IsUserIdentifier, {
		message:
			'This field must contain a valid email or username. Username field can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	userIdentifier: string;

	@MinLength(6, { message: 'Password must contain at least 6 characters' })
	password: string;
}
