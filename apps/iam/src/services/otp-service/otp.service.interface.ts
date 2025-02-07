import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { IValidateOtpRo } from '~libs/ro/iam';

import { OtpModel } from '~/iam/prisma/client';

export interface IOtpService {
	upsert: (dto: UpsertOtpDto) => Promise<{ otp: OtpModel; testMailUrl: string | null }>;
	validate: (dto: ValidateOtpDto) => Promise<IValidateOtpRo>;
}
