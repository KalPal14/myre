import { IBaseUserRo } from './common/base-user.ro';

export interface IUpdateUserRo extends IBaseUserRo {
	jwt?: string;
}
