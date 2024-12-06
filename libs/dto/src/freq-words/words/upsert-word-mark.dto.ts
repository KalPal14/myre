import { DictionaryDto } from './common/dictionary.dto';
import { WordDto } from './common/word.dto';

export class UpsertWordMarkDto {
	word: WordDto;
	dictionaryFrom: DictionaryDto;
	dictionaryTo: DictionaryDto;
	workspaceId: number;
}
