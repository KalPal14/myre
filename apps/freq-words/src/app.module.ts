import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { TranslationModule } from './resources/translator/translator.module';
import { LanguagesModule } from './resources/languages/languages.module';
import { WordMarksModule } from './resources/word-marks/word-marks.module';
import { WorkspacesModule } from './resources/workspaces/workspaces.module';
import { SourceModule } from './resources/source/source.module';

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
		LanguagesModule,
		SourceModule,
		TranslationModule,
		WordMarksModule,
		WorkspacesModule,
	],
})
export class AppModule {}
