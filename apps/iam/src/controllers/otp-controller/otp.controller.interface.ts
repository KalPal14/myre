import { Router } from 'express';

import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { TController } from '~libs/express-core';

export interface IOtpController {
	router: Router;

	upsert: TController<null, UpsertOtpDto>;
	validate: TController<null, ValidateOtpDto>;
}
