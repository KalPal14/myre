import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesModule } from '../languages/languages.module';

import { Example } from './entities/example.entity';
import { WordFormsService } from './word-forms.service';
import { WordForm } from './entities/word-form.entity';
import { Definition } from './entities/definition.entity';

@Module({
	imports: [
		NestCoreModule,
		TypeOrmModule.forFeature([WordForm, Definition, Example]),
		LanguagesModule,
	],
	providers: [WordFormsService],
	exports: [WordFormsService],
})
export class WordFormsModule {}
