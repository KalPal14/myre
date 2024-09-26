import { IsJSON } from 'class-validator';

export class GetHighlightsDto {
	@IsJSON({ message: 'This field must contain an array of IDs in JSON format' })
	ids: string;
}
