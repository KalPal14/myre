import 'reflect-metadata';

import { type Express } from 'express';
import request from 'supertest';

import { configEnv } from '~libs/express-core/config';
import { UpsertOtpDto, ValidateOtpDto } from '~libs/dto/iam';
import { OTP_URLS } from '~libs/routes/iam';

import { bootstrap } from '~/iam/main';
import { CREATE_USER_DTO } from '~/iam/common/stubs/users';
import { OtpModel } from '~/iam/prisma/client';

configEnv();

let app: Express;

beforeAll(async () => {
	const application = await bootstrap();
	app = application.app;
});

describe('Otp', () => {
	describe('upsert', () => {
		it('shoud return upserted otp and testMailUrl', async () => {
			const dto: UpsertOtpDto = { email: CREATE_USER_DTO().email };

			const res = await request(app).post(OTP_URLS.upsert).send(dto);

			expect(res.statusCode).toBe(200);
			expect(res.body.otp.email).toBe(dto.email);
			expect(res.body.otp.id).toBeDefined();
			expect(res.body.otp.code).toBeDefined();
			expect(res.body.otp.updatedAt).toBeDefined();
			expect(res.body.testMailUrl).toBeDefined();
		});
	});

	describe('validate', () => {
		let upsertDto: UpsertOtpDto;
		let otp: OtpModel;
		beforeEach(async () => {
			upsertDto = { email: CREATE_USER_DTO().email };
			const upsertOtpRes = await request(app).post(OTP_URLS.upsert).send(upsertDto);
			otp = upsertOtpRes.body.otp;
		});

		describe('pass email for which otp has not yet been generated', () => {
			it('should throw an error', async () => {
				const dto: ValidateOtpDto = { email: CREATE_USER_DTO().email, code: 123123 };

				const res = await request(app).post(OTP_URLS.validate).send(dto);

				expect(res.statusCode).toBe(404);
			});
		});

		describe('pass invalid or expired otp', () => {
			it('should throw an error', async () => {
				const dto: ValidateOtpDto = { email: upsertDto.email, code: otp.code - 1 };

				const res = await request(app).post(OTP_URLS.validate).send(dto);

				expect(res.statusCode).toBe(400);
			});
		});

		describe('pass correct email and code', () => {
			it('shod return success msg', async () => {
				const dto: ValidateOtpDto = { email: upsertDto.email, code: otp.code };

				const res = await request(app).post(OTP_URLS.validate).send(dto);

				expect(res.statusCode).toBe(200);
				expect(res.body).toEqual({ success: true });
			});
		});
	});
});
