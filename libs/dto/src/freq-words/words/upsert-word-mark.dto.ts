import { DefinitionDto } from './common/definition.dto';
import { WordDto } from './common/word.dto';

export class UpsertWordMarkDto {
	word: WordDto;
	definitionFrom: DefinitionDto;
	definitionTo: DefinitionDto;
	workspaceId: number;
}
