import { IsString } from 'class-validator';

export class TranslateDto {
	@IsString()
	from: string;

	@IsString()
	to: string;

	@IsString()
	translate: string;
}
