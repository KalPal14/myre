import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesModule } from '../languages/languages.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { Definition } from '../translator/entities/definition.entity';
import { Example } from '../translator/entities/example.entity';
import { SourceModule } from '../source/source.module';

import { WordMarksService } from './word-marks.service';
import { WordMarksController } from './word-marks.controller';
import { WordForm } from './entities/word-form.entity';
import { WordFormMark } from './entities/word-form-mark.entity';
import { WordMark } from './entities/word-mark.entity';

@Module({
	imports: [
		NestCoreModule,
		TypeOrmModule.forFeature([WordForm, WordFormMark, WordMark, Definition, Example]),
		LanguagesModule,
		SourceModule,
		WorkspacesModule,
	],
	controllers: [WordMarksController],
	providers: [WordMarksService],
})
export class WordMarksModule {}
