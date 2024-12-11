import { IBaseLanguageRo } from '../languages/common/base-language.ro';

import { IBaseWorkspaceRo } from './common/base-workspace.ro';

export interface ICreateWorkspaceRo extends IBaseWorkspaceRo {
	knownLanguage: IBaseLanguageRo;
	targetLanguage: IBaseLanguageRo;
}
