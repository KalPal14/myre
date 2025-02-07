import 'reflect-metadata';
import { Container } from 'inversify';

import { MailerService } from '~libs/express-core';
import { ValidateOtpDto } from '~libs/dto/iam';

import { TYPES } from '~/iam/common/constants/types';
import { IOtpRepository } from '~/iam/repositories/otp-repository/otp.repository.interface';
import { IOtpFactory } from '~/iam/domain/otp/factory/otp.factory.interface';
import { OTP, OTP_MODEL } from '~/iam/common/stubs/otp';
import { Otp } from '~/iam/domain/otp/otp';

import { IOtpService } from './otp.service.interface';
import { OtpService } from './otp.service';

const otpRepositoryMock: IOtpRepository = {
	findBy: jest.fn(),
	upsert: jest.fn(),
};

const otpFactoryMock: IOtpFactory = {
	create: jest.fn(),
};
const mailerServiceMock: MailerService = {
	sendMail: jest.fn(),
};

const container = new Container();
let otpService: IOtpService;
let otpRepository: IOtpRepository;
let otpFactory: IOtpFactory;
let mailerService: MailerService;

beforeAll(() => {
	container.bind<IOtpService>(TYPES.OtpService).to(OtpService);
	container.bind<IOtpRepository>(TYPES.OtpRepository).toConstantValue(otpRepositoryMock);
	container.bind<IOtpFactory>(TYPES.OtpFactory).toConstantValue(otpFactoryMock);
	container.bind<MailerService>(TYPES.MailerService).toConstantValue(mailerServiceMock);

	otpService = container.get<IOtpService>(TYPES.OtpService);
	otpRepository = container.get<IOtpRepository>(TYPES.OtpRepository);
	otpFactory = container.get<IOtpFactory>(TYPES.OtpFactory);
	mailerService = container.get<MailerService>(TYPES.MailerService);
});

beforeEach(() => {
	jest.clearAllMocks();
});

describe('OtpService', () => {
	describe('upsert', () => {
		it('shoud return upserted otp and testMailUrl', async () => {
			const testMailUrl = 'mock-test-mail-url';
			const otpEntity = OTP_MODEL();
			otpFactory.create = jest.fn().mockReturnValue(OTP);
			mailerService.sendMail = jest.fn().mockReturnValue(testMailUrl);
			otpRepository.upsert = jest
				.fn()
				.mockImplementation((data: Otp) => ({ ...otpEntity, ...data }));

			const result = await otpService.upsert({ email: OTP.email });

			expect(result).toEqual({
				otp: otpEntity,
				testMailUrl,
			});
		});
	});

	describe('validate', () => {
		const dto: ValidateOtpDto = { ...OTP, code: OTP.code.toString() };

		describe('pass email for which otp has not yet been generated', () => {
			it('should throw an error', async () => {
				otpRepository.findBy = jest.fn().mockResolvedValue(null);

				try {
					await otpService.validate(dto);
				} catch (err: any) {
					expect(err.statusCode).toBe(404);
					expect(err.message).toBe(`One-time password for ${dto.email} does not exist`);
				}
			});
		});

		describe('pass invalid or expired otp', () => {
			it('should throw an error', async () => {
				otpRepository.findBy = jest.fn().mockResolvedValue(OTP_MODEL());
				otpFactory.create = jest
					.fn()
					.mockReturnValue({ ...OTP, compereOtp: jest.fn().mockReturnValue(false) });

				try {
					await otpService.validate(dto);
				} catch (err: any) {
					expect(err.statusCode).toBe(400);
					expect(err.message).toBe('One-time password is incorrect or outdated');
				}
			});
		});

		describe('pass correct email and code', () => {
			it('shod return success msg', async () => {
				otpRepository.findBy = jest.fn().mockResolvedValue(OTP_MODEL());
				otpFactory.create = jest
					.fn()
					.mockReturnValue({ ...OTP, compereOtp: jest.fn().mockReturnValue(true) });

				const result = await otpService.validate(dto);

				expect(result).toEqual({ success: true });
			});
		});
	});
});
