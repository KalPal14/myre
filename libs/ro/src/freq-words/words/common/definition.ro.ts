import { IGetLanguageRo } from '../../languages/get-language.ro';

export interface IDefinitionRo {
	id: number;
	word_form_id: number;
	language: IGetLanguageRo;
	synonyms: string[];
	description: string;
	examples: string[];
}
