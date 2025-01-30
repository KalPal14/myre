import { Otp } from '../otp';

export interface IOtpData extends Pick<Otp, 'email'> {
	code?: number;
}

export interface IOtpFactory {
	create: (otpData: IOtpData) => Otp;
}
