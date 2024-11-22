import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '~/freq-words/app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				TypeOrmModule.forRoot({
					type: 'postgres',
					host: 'localhost',
					port: 5431, // TODO: take from env
					username: 'postgres',
					password: 'postgres',
					database: 'postgres',
					autoLoadEntities: true,
					synchronize: true, // TODO: in dev true, in prod false
				}),
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
	});
});
