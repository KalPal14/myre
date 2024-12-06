import { IsString } from 'class-validator';

export class DictionaryDto {
	@IsString()
	language: string;

	@IsString()
	synonyms: string[];

	@IsString()
	description: string;

	@IsString()
	examples: string[];
}
