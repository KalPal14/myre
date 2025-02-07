import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/iam/common/constants/types';
import { OtpController } from '~/iam/controllers/otp-controller/otp.controller';
import { IOtpController } from '~/iam/controllers/otp-controller/otp.controller.interface';
import { OtpFactory } from '~/iam/domain/otp/factory/otp.factory';
import { IOtpFactory } from '~/iam/domain/otp/factory/otp.factory.interface';
import { OtpRepository } from '~/iam/repositories/otp-repository/otp.repository';
import { IOtpRepository } from '~/iam/repositories/otp-repository/otp.repository.interface';
import { OtpService } from '~/iam/services/otp-service/otp.service';
import { IOtpService } from '~/iam/services/otp-service/otp.service.interface';

export const otpBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IOtpController>(TYPES.OtpController).to(OtpController);
	bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);
	bind<IOtpService>(TYPES.OtpService).to(OtpService).inSingletonScope();
	bind<IOtpFactory>(TYPES.OtpFactory).to(OtpFactory);
});
