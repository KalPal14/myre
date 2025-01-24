import { IGetLanguageRo } from '../languages/get-language.ro';

import { IWordFormRo } from './word-form.ro';

export interface IDefinitionRo {
	id: number;
	description: string;
	language: IGetLanguageRo;
	synonyms: Pick<IWordFormRo, 'id' | 'name'>[];
	examples: { id: number; phrase: string }[];
}
