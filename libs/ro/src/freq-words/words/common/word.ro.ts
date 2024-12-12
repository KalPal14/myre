import { IGetLanguageRo } from '../../languages/get-language.ro';

import { IDefinitionRo } from './definition.ro';

export interface IWordRo {
	id: number;
	name: string;
	language: IGetLanguageRo;
	definition: {
		knownLanguage: IDefinitionRo;
		tragetLanguage: IDefinitionRo;
	};
}
