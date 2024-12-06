import { IsNumber, IsString } from 'class-validator';

export class TranslateDto {
	@IsNumber({}, { message: 'language ID must be a number' })
	from: number;

	@IsNumber({}, { message: 'language ID must be a number' })
	to: number;

	@IsString()
	translate: string;
}
