import { IsOptional, Validate } from 'class-validator';

import { UserModel } from '~/highlight-extension/prisma/client';
import { IsColors } from '~/highlight-extension/utils/dto-validation-rules/is-colors';

export class UpdateUserDto implements Partial<UserModel> {
	@IsOptional()
	@Validate(IsColors, {
		message: 'The colors field must contain an array of colors in RGB or HEX format',
	})
	colors?: string[];
}
