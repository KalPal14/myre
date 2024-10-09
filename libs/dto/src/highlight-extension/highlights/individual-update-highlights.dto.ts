import { IsArray, IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UpdateHighlightDto } from './update-highlight.dto';

class IndividualUpdateHighlightsItemDto {
	@IsNumber({}, { message: 'The id must be a number' })
	id: number;

	@IsDefined({ message: 'The payload field must be defined' })
	@ValidateNested()
	@Type(() => UpdateHighlightDto)
	payload: UpdateHighlightDto;
}

export class IndividualUpdateHighlightsDto {
	@IsArray({ message: 'highlights must be an array' })
	@ValidateNested({ each: true })
	@Type(() => IndividualUpdateHighlightsItemDto)
	highlights: IndividualUpdateHighlightsItemDto[];
}
