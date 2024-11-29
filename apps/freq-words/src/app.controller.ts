import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { GetHighlightsDto, CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { Roles } from '~libs/nest-core';

import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	postHello(
		@Req() req: Request,
		@Body() body: CreateWorkspaceDto,
		@Query() query: GetHighlightsDto
	): any {
		return { user: req.user ?? null, resp: this.appService.getHello(), body, query, a: 'a' };
	}

	@Roles('guest')
	@Get()
	getHello(): any {
		return this.appService.getHello();
	}
}
