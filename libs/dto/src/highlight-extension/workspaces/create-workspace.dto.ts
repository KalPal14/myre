import { IsString, Validate } from 'class-validator';

import { IsColors } from '~libs/common';

export class CreateWorkspaceDto {
	@IsString({ message: 'This field must contain a strng' })
	readonly name: string;

	@Validate(IsColors, {
		message: 'This field must contain an array of colors in rgb or hex format',
	})
	readonly colors: string[];
}
