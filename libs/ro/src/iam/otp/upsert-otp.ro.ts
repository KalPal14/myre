import { IOtpRo } from './common/otp.ro';

export interface IUpsertOtpRo {
	otp: IOtpRo;
	testMailUrl: string | null;
}
