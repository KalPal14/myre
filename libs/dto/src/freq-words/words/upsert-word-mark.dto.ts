import { IsDefined, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { DefinitionDto } from './common/definition.dto';
import { WordDto } from './common/word.dto';

export class UpsertWordMarkDto {
	@IsDefined()
	@ValidateNested()
	@Type(() => WordDto)
	word: WordDto;

	@IsDefined()
	@ValidateNested()
	@Type(() => DefinitionDto)
	definitionFrom: DefinitionDto;

	@IsDefined()
	@ValidateNested()
	@Type(() => DefinitionDto)
	definitionTo: DefinitionDto;

	@IsNumber()
	workspaceId: number;
}
