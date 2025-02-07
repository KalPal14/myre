import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { ValidateMiddleware, TController, BaseController, RoleGuard } from '~libs/express-core';
import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { OTP_ENDPOINTS } from '~libs/routes/iam';

import { TYPES } from '~/iam/common/constants/types';
import { IOtpService } from '~/iam/services/otp-service/otp.service.interface';

import { IOtpController } from './otp.controller.interface';

@injectable()
export class OtpController extends BaseController implements IOtpController {
	constructor(@inject(TYPES.OtpService) private otpService: IOtpService) {
		super();
		this.bindRoutes([
			{
				path: OTP_ENDPOINTS.upsert,
				method: 'post',
				func: this.upsert,
				middlewares: [new RoleGuard('*'), new ValidateMiddleware(UpsertOtpDto)],
			},
			{
				path: OTP_ENDPOINTS.validate,
				method: 'post',
				func: this.validate,
				middlewares: [new RoleGuard('*'), new ValidateMiddleware(ValidateOtpDto)],
			},
		]);
	}

	upsert: TController<null, UpsertOtpDto> = async ({ body }, res) => {
		const { testMailUrl } = await this.otpService.upsert(body);
		this.ok(res, { testMailUrl });
	};

	validate: TController<null, ValidateOtpDto> = async ({ body }, res) => {
		const result = await this.otpService.validate(body);
		this.ok(res, result);
	};
}
