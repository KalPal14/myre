import { IGetLanguageRo } from '../../languages/get-language.ro';

import { IWordRo } from './word.ro';

export interface IDefinitionRo {
	id: number;
	description: string;
	language: IGetLanguageRo;
	synonyms: Pick<IWordRo, 'id' | 'name'>[];
	examples: { id: number; phrase: string }[];
}
