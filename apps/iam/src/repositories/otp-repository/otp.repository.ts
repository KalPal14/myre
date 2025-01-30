import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { OtpModel } from '~/iam/prisma/client';
import { TYPES } from '~/iam/common/constants/types';
import { TPrismaService } from '~/iam/common/types/prisma-service.interface';
import { Otp } from '~/iam/domain/otp/otp';

import { IOtpRepository } from './otp.repository.interface';

@injectable()
export class OtpRepository implements IOtpRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: TPrismaService) {}

	findBy(findData: Partial<OtpModel>): Promise<OtpModel | null> {
		return this.prismaService.client.otpModel.findFirst({
			where: findData,
		});
	}

	upsert(data: Otp): Promise<OtpModel> {
		return this.prismaService.client.otpModel.upsert({
			where: { email: data.email },
			create: data,
			update: data,
		});
	}
}
