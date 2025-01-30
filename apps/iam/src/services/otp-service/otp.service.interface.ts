import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { IUpsertOtpRo, IValidateOtpRo } from '~libs/ro/iam';

export interface IOtpService {
	upsert: (dto: UpsertOtpDto) => Promise<IUpsertOtpRo>;
	validate: (dto: ValidateOtpDto) => Promise<IValidateOtpRo>;
}
