import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';

import { CreateHighlightDto } from './create-highlight.dto';

export class UpdateHighlightDto extends PartialType(CreateHighlightDto) {
	@IsOptional()
	@IsNumber()
	order?: number;
}
