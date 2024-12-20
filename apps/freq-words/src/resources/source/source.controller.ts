import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { GetOrCreateSourceDto, GetSourcesDto, UpdateSourceDto } from '~libs/dto/freq-words';
import { SOURCES_BASE_ROUTE, SOURCES_ENDPOINTS } from '~libs/routes/freq-words';
import {
	IDeleteSourceRo,
	IGetOrCreateSourceRo,
	IGetSourceRo,
	IUpdateSourceRo,
	TGetSourcesRo,
} from '~libs/ro/freq-words';

import { SourceService } from './source.service';

@Controller(SOURCES_BASE_ROUTE)
export class SourceController {
	constructor(private readonly sourceService: SourceService) {}

	@Post(SOURCES_ENDPOINTS.getOrCreate)
	getOrCreate(@Body() dto: GetOrCreateSourceDto): Promise<IGetOrCreateSourceRo> {
		return this.sourceService.getOrCreate(dto);
	}

	@Get(SOURCES_ENDPOINTS.getMany)
	getMany(@Query() dto: GetSourcesDto): Promise<TGetSourcesRo> {
		return this.sourceService.getMany(dto);
	}

	@Get(SOURCES_ENDPOINTS.get)
	getOne(@Param('id') id: string): Promise<IGetSourceRo> {
		return this.sourceService.getOne(+id);
	}

	@Patch(SOURCES_ENDPOINTS.update)
	update(@Param('id') id: string, @Body() dto: UpdateSourceDto): Promise<IUpdateSourceRo> {
		return this.sourceService.update(+id, dto);
	}

	@Delete(SOURCES_ENDPOINTS.delete)
	delete(@Param('id') id: string): Promise<IDeleteSourceRo> {
		return this.sourceService.delete(+id);
	}
}
