import { IBaseLanguageRo } from '../../languages/common/base-language.ro';

export interface IBaseWorkspaceRo {
	id: number;
	ownerId: number;
	name: string;
	knownLanguage: IBaseLanguageRo;
	targetLanguage: IBaseLanguageRo;
}
