import { Body, Controller, Post, Query } from '@nestjs/common';

import { GetHighlightsDto, CreateWorkspaceDto } from '~libs/dto/highlight-extension';

import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	getHello(@Body() body: CreateWorkspaceDto, @Query() query: GetHighlightsDto): any {
		return { resp: this.appService.getHello(), body, query };
	}
}
