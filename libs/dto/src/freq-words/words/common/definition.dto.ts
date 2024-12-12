import { IsNumber, IsString } from 'class-validator';

export class DefinitionDto {
	@IsNumber()
	languageId: number;

	@IsString()
	synonyms: string[];

	@IsString()
	description: string;

	@IsString()
	examples: string[];
}
