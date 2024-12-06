import { IsNumber, IsString } from 'class-validator';

export class DictionaryDto {
	@IsNumber()
	languageId: number;

	@IsString()
	synonyms: string[];

	@IsString()
	description: string;

	@IsString()
	examples: string[];
}
