import { JWT_PAYLOAD } from '~libs/common';

import { OtpModel } from '~/iam/prisma/client';
import { Otp } from '~/iam/domain/otp/otp';

export const OTP: Omit<Otp, 'compereOtp'> = {
	email: JWT_PAYLOAD.email,
	code: 123123,
};

export const OTP_MODEL = (): OtpModel => ({
	id: 1,
	...OTP,
	updatedAt: new Date(),
});
