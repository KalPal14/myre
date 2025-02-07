import { IBaseUserRo } from './common/base-user.ro';

export interface IRegistrationRo {
	jwt: string;
	user: IBaseUserRo;
}
