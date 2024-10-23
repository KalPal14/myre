import { IBaseUserRo } from './common/base-user.ro';

export interface ILoginRo extends IBaseUserRo {
	jwt: string;
}
