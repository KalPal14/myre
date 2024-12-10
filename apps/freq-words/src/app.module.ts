import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { NestCoreModule } from '~libs/nest-core';

import { TranslationModule } from './resources/translator/translator.module';
import { LanguagesModule } from './resources/languages/languages.module';
import { WordsModule } from './resources/words/words.module';
import { WorkspacesModule } from './resources/workspaces/workspaces.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: join(
				__dirname,
				process.env.NODE_ENV !== 'test' ? '..' : '',
				`../../../.env.${process.env.NODE_ENV || 'dev'}`
			),
		}),
		TypeOrmModule,
		NestCoreModule,
		LanguagesModule,
		TranslationModule,
		WordsModule,
		WorkspacesModule,
	],
})
export class AppModule {}
