import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesModule } from '../languages/languages.module';

import { TranslatorService } from './translator.service';
import { TranslatorController } from './translator.controller';
import { Definition } from './entities/definition.entity';
import { Example } from './entities/example.entity';

@Module({
	imports: [NestCoreModule, TypeOrmModule.forFeature([Definition, Example]), LanguagesModule],
	controllers: [TranslatorController],
	providers: [TranslatorService],
})
export class TranslationModule {}
