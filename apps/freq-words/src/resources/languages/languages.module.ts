import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { Language } from './entities/language.entity';

@Module({
	imports: [NestCoreModule, TypeOrmModule.forFeature([Language])],
	controllers: [LanguagesController],
	providers: [LanguagesService],
	exports: [LanguagesService],
})
export class LanguagesModule {}
