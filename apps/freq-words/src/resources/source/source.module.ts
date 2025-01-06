import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspacesModule } from '../workspaces/workspaces.module';

import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { Source } from './entities/source.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Source]), WorkspacesModule],
	controllers: [SourceController],
	providers: [SourceService],
	exports: [SourceService],
})
export class SourceModule {}
