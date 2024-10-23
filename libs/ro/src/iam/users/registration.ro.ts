import { IBaseUserRo } from './common/base-user.ro';

export interface IRegistrationRo extends IBaseUserRo {
	jwt: string;
}
