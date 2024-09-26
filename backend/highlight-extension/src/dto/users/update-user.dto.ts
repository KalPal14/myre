import { UserModel } from '@prisma/client';
import { IsOptional, Validate } from 'class-validator';

import { IsColors } from '@/utils/dto-validation-rules/is-colors';

export class UpdateUserDto implements Partial<UserModel> {
	@IsOptional()
	@Validate(IsColors, {
		message: 'The colors field must contain an array of colors in RGB or HEX format',
	})
	colors?: string[];
}
