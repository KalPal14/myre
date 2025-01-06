import { IsDefined, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { DefinitionDto } from './common/definition.dto';

export class UpsertWordMarkDto {
	@IsNumber()
	workspaceId: number;

	@IsOptional()
	@IsUrl()
	sourceLink?: string;

	@IsString()
	wordForm: string;

	@IsOptional()
	@IsString()
	lemma: string | null;

	@IsDefined()
	@ValidateNested()
	@Type(() => DefinitionDto)
	definitionFrom: DefinitionDto;

	@IsDefined()
	@ValidateNested()
	@Type(() => DefinitionDto)
	definitionTo: DefinitionDto;
}
