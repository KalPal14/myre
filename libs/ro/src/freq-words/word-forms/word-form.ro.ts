import { IGetLanguageRo } from '../languages/get-language.ro';

import { IDefinitionRo } from './definition.ro';

export interface IWordFormRo {
	id: number;
	name: string;
	language: IGetLanguageRo;
	definitions: IDefinitionRo[];
}
