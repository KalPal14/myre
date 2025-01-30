import { Otp } from '~/iam/domain/otp/otp';
import { OtpModel } from '~/iam/prisma/client';

export interface IOtpRepository {
	findBy: (findData: Partial<OtpModel>) => Promise<OtpModel | null>;

	upsert: (data: Otp) => Promise<OtpModel>;
}
