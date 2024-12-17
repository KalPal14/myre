import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { LanguagesModule } from '../languages/languages.module';

import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Workspace } from './entities/workspace.entity';

@Module({
	imports: [NestCoreModule, TypeOrmModule.forFeature([Workspace]), LanguagesModule],
	controllers: [WorkspacesController],
	providers: [WorkspacesService],
	exports: [WorkspacesService],
})
export class WorkspacesModule {}
