import { IsNumber, IsString } from 'class-validator';

export class DefinitionDto {
	@IsNumber()
	languageId: number;

	@IsString({ each: true })
	synonyms: string[];

	@IsString()
	description: string;

	@IsString({ each: true })
	examples: string[];
}
