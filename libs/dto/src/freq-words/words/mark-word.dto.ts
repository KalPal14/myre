import { DictionaryDto } from '../translation/common/dictionary.dto';

import { WordDto } from './common/word.dto';

export class MarkWordDto {
	word: WordDto;
	dictionaryFrom: DictionaryDto;
	dictionaryTo: DictionaryDto;
	wordSets: string[];
}
