import { Module } from '@nestjs/common';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesModule } from '../languages/languages.module';

import { TranslatorService } from './translator.service';
import { TranslatorController } from './translator.controller';

@Module({
	imports: [NestCoreModule, LanguagesModule],
	controllers: [TranslatorController],
	providers: [TranslatorService],
})
export class TranslationModule {}
