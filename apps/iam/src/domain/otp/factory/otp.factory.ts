import { injectable } from 'inversify';

import { Otp } from '../otp';

import { IOtpData, IOtpFactory } from './otp.factory.interface';

@injectable()
export class OtpFactory implements IOtpFactory {
	create(otpData: IOtpData): Otp {
		const code = otpData.code ? otpData.code : Math.floor(100000 + Math.random() * 900000);
		return new Otp(otpData.email, code);
	}
}
