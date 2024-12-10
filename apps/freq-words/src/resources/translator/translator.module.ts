import { Module } from '@nestjs/common';

import { NestCoreModule } from '~libs/nest-core';

import { TranslatorService } from './translator.service';
import { TranslatorController } from './translator.controller';

@Module({
	imports: [NestCoreModule],
	controllers: [TranslatorController],
	providers: [TranslatorService],
})
export class TranslationModule {}
