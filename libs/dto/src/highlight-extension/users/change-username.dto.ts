import { Matches } from 'class-validator';

import { USERNAME } from '~libs/common';

export class ChangeUsernameDto {
	@Matches(USERNAME, {
		message:
			'Username can only contain uppercase and lowercase letters, as well as the characters - and _',
	})
	newUsername: string;
}
