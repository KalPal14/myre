import { Module } from '@nestjs/common';

import { NestCoreModule } from '~libs/nest-core';

import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';

@Module({
	imports: [NestCoreModule],
	controllers: [TranslationController],
	providers: [TranslationService],
})
export class TranslationModule {}
