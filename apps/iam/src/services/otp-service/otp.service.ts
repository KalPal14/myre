import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { HTTPError } from '~libs/common';
import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { IUpsertOtpRo, IValidateOtpRo } from '~libs/ro/iam';
import { MailerService } from '~libs/express-core';

import { TYPES } from '~/iam/common/constants/types';
import { IOtpRepository } from '~/iam/repositories/otp-repository/otp.repository.interface';
import { IOtpFactory } from '~/iam/domain/otp/factory/otp.factory.interface';

import { IOtpService } from './otp.service.interface';

@injectable()
export class OtpService implements IOtpService {
	constructor(
		@inject(TYPES.OtpRepository) private otpRepository: IOtpRepository,
		@inject(TYPES.OtpFactory) private otpFactory: IOtpFactory,
		@inject(TYPES.MailerService) private mailerService: MailerService
	) {}

	async upsert({ email }: UpsertOtpDto): Promise<IUpsertOtpRo> {
		const otp = this.otpFactory.create({ email });
		const testMailUrl = await this.mailerService.sendMail({
			to: email,
			subject: 'Email Verification Code',
			text: `Your Email Verification Code is: ${otp.code}`,
			html: `<p>Your Email Verification Code is: <h1>${otp.code}</h1></p>`,
		});
		const otpEntity = await this.otpRepository.upsert(otp);
		return { otp: otpEntity, testMailUrl };
	}

	async validate(dto: ValidateOtpDto): Promise<IValidateOtpRo> {
		const existingOtp = await this.otpRepository.findBy({ email: dto.email });
		if (!existingOtp) {
			throw new HTTPError(404, `One-time password for ${dto.email} does not exist`);
		}

		const isValid = this.otpFactory.create(dto).compereOtp(existingOtp.code, existingOtp.updatedAt);
		if (!isValid) {
			throw new HTTPError(400, 'One-time password is incorrect or outdated');
		}
		return { success: true };
	}
}
