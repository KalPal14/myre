import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { WordForm } from './entities/word-form.entity';
import { WordFormMark } from './entities/word-form-mark.entity';
import { Word } from './entities/word.entity';
import { WordMark } from './entities/word-mark.entity';

@Module({
	imports: [NestCoreModule, TypeOrmModule.forFeature([WordForm, WordFormMark, Word, WordMark])],
	controllers: [WordsController],
	providers: [WordsService],
})
export class WordsModule {}
