import { IGetLanguageRo } from '../../languages/get-language.ro';

import { IDictionaryRo } from './dictionary.ro';

export interface IWordRo {
	id: number;
	name: string;
	language: IGetLanguageRo;
	dictionary: {
		knownLanguage: IDictionaryRo;
		tragetLanguage: IDictionaryRo;
	};
}
