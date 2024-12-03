import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { NestCoreModule } from '~libs/nest-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationModule } from './translation/translation.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: join(
				__dirname,
				process.env.NODE_ENV !== 'test' ? '..' : '',
				`../../../.env.${process.env.NODE_ENV || 'dev'}`
			),
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.FREQ_WORDS_HOST,
			port: +process.env.FREQ_WORDS_DB_PORT!,
			username: process.env.FREQ_WORDS_DB_USERNAME,
			password: process.env.FREQ_WORDS_DB_PASSWORD,
			database: process.env.FREQ_WORDS_DB_NAME,
			autoLoadEntities: true,
			synchronize: process.env.NODE_ENV !== 'prod',
		}),
		NestCoreModule,
		TranslationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
