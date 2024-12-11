import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestCoreModule } from '~libs/nest-core';

import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Workspace } from './entities/workspace.entity';

@Module({
	imports: [NestCoreModule, TypeOrmModule.forFeature([Workspace])],
	controllers: [WorkspacesController],
	providers: [WorkspacesService],
})
export class WorkspacesModule {}
