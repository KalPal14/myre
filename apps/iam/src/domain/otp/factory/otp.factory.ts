import { generate } from 'randomstring';
import { injectable } from 'inversify';

import { Otp } from '../otp';

import { IOtpData, IOtpFactory } from './otp.factory.interface';

@injectable()
export class OtpFactory implements IOtpFactory {
	create(otpData: IOtpData): Otp {
		const code = otpData.code ? otpData.code : +generate({ charset: 'numeric', length: 6 });
		return new Otp(otpData.email, code);
	}
}
