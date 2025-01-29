import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';

import { IBaseUserRo } from './common/base-user.ro';

export interface IRegistrationRo {
	jwt: string;
	user: IBaseUserRo;
	workspace: ICreateWorkspaceRo;
	testMailUrl: string | null;
}
