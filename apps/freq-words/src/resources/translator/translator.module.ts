import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { TranslatorService } from './translator.service';
import { TranslatorController } from './translator.controller';
import { Dictionary } from './entities/dictionary.entity';
import { Example } from './entities/example.entity';

@Module({
	imports: [NestCoreModule, TypeOrmModule.forFeature([Dictionary, Example])],
	controllers: [TranslatorController],
	providers: [TranslatorService],
})
export class TranslationModule {}
