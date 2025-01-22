import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesModule } from '../languages/languages.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { SourceModule } from '../source/source.module';
import { WordFormsModule } from '../word-forms/word-forms.module';

import { WordMarksService } from './word-marks.service';
import { WordMarksController } from './word-marks.controller';
import { WordFormMark } from './entities/word-form-mark.entity';
import { WordMark } from './entities/word-mark.entity';

@Module({
	imports: [
		NestCoreModule,
		TypeOrmModule.forFeature([WordMark, WordFormMark]),
		LanguagesModule,
		SourceModule,
		WorkspacesModule,
		WordFormsModule,
	],
	controllers: [WordMarksController],
	providers: [WordMarksService],
})
export class WordMarksModule {}
