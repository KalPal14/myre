import { Controller, Get, Body, Param, Query, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { WORD_MARKS_BASE_ROUTE, WORD_MARKS_ENDPOINTS } from '~libs/routes/freq-words';
import { GetWordMarksDto, UpsertWordMarkDto } from '~libs/dto/freq-words';
import { IUpsertWordMarkRo, TGetWordMarksRo } from '~libs/ro/freq-words';

import { WordMarksService } from './word-marks.service';

@Controller(WORD_MARKS_BASE_ROUTE)
export class WordMarksController {
	constructor(private readonly wordsService: WordMarksService) {}

	@HttpCode(HttpStatus.OK)
	@Post(WORD_MARKS_ENDPOINTS.upsert)
	async upsert(@Body() dto: UpsertWordMarkDto): Promise<IUpsertWordMarkRo> {
		const { wordMarkId } = await this.wordsService.upsert(dto);
		return this.wordsService.getOne(wordMarkId);
	}

	@Get(WORD_MARKS_ENDPOINTS.getMany)
	getMany(@Query() dto: GetWordMarksDto): Promise<TGetWordMarksRo> {
		return this.wordsService.getMany(dto);
	}

	@Get(WORD_MARKS_ENDPOINTS.get)
	getOne(@Param('id') id: string): Promise<IUpsertWordMarkRo> {
		return this.wordsService.getOne(+id);
	}
}
