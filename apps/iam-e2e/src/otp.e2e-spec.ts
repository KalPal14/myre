import 'reflect-metadata';

import { type Express } from 'express';
import request from 'supertest';

import { configEnv } from '~libs/express-core/config';
import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { OTP_URLS } from '~libs/routes/iam';

import { CREATE_USER_DTO } from '~/iam/common/stubs/users';
import { IOtpService } from '~/iam/services/otp-service/otp.service.interface';
import { OtpModel } from '~/iam/prisma/client';
import { bootstrap } from '~/iam/main';

configEnv();

describe('Otp', () => {
	let app: Express;
	let otpService: IOtpService;

	beforeAll(async () => {
		const inst = await bootstrap();
		app = inst.app.app;
		otpService = inst.otpService;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('upsert', () => {
		it('shoud return testMailUrl', async () => {
			const dto: UpsertOtpDto = { email: CREATE_USER_DTO().email };
			const res = await request(app).post(OTP_URLS.upsert).send(dto);

			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual({
				testMailUrl: expect.stringContaining('https://ethereal.email/message/'),
			});
		});
	});

	describe('validate', () => {
		let upsertDto: UpsertOtpDto;
		let otp: OtpModel;
		beforeEach(async () => {
			upsertDto = { email: CREATE_USER_DTO().email };

			const otpServiceUpsert = jest.spyOn(otpService, 'upsert');
			await request(app).post(OTP_URLS.upsert).send(upsertDto);
			otp = await otpServiceUpsert.mock.results[0].value.then(({ otp }: { otp: OtpModel }) => otp);
		});

		describe('pass email for which otp has not yet been generated', () => {
			it('should throw an error', async () => {
				const dto: ValidateOtpDto = { email: CREATE_USER_DTO().email, code: '123123' };

				const res = await request(app).post(OTP_URLS.validate).send(dto);

				expect(res.statusCode).toBe(404);
			});
		});

		describe('pass invalid or expired otp', () => {
			it('should throw an error', async () => {
				const dto: ValidateOtpDto = { email: upsertDto.email, code: (otp.code - 1).toString() };

				const res = await request(app).post(OTP_URLS.validate).send(dto);

				expect(res.statusCode).toBe(400);
			});
		});

		describe('pass correct email and code', () => {
			it('shod return success msg', async () => {
				const dto: ValidateOtpDto = { email: upsertDto.email, code: otp.code.toString() };

				const res = await request(app).post(OTP_URLS.validate).send(dto);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({ success: true });
			});
		});
	});
});
