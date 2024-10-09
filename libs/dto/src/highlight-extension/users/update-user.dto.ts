import { IsOptional, Validate } from 'class-validator';

import { IsColors } from '~libs/common';

export class UpdateUserDto {
	@IsOptional()
	@Validate(IsColors, {
		message: 'The colors field must contain an array of colors in RGB or HEX format',
	})
	colors?: string[];
}
