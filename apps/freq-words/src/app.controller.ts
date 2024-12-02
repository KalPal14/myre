import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { GetHighlightsDto, CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { AiService, Roles } from '~libs/nest-core';

import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly aiService: AiService
	) {}

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

	@Roles('guest', 'user')
	@Get('/prompt')
	prompt(@Query() query: { prompt: string }): any {
		return this.aiService.prompt(query.prompt, { originality: 0.5 });
	}
}
