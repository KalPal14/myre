import { Controller, Get, Body, Param, Query, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { WORDS_BASE_ROUTE, WORDS_ENDPOINTS } from '~libs/routes/freq-words';
import { GetWordsMarksDto, UpsertWordMarkDto } from '~libs/dto/freq-words';
import { IUpsertWordMarkRo, TGetWordsMarksRo } from '~libs/ro/freq-words';

import { WordsService } from './words.service';

@Controller(WORDS_BASE_ROUTE)
export class WordsController {
	constructor(private readonly wordsService: WordsService) {}

	@HttpCode(HttpStatus.OK)
	@Post(WORDS_ENDPOINTS.upsertMark)
	async upsertMark(@Body() dto: UpsertWordMarkDto): Promise<IUpsertWordMarkRo> {
		const { wordMarkId } = await this.wordsService.upsertMark(dto);
		return this.wordsService.getOneMark(wordMarkId);
	}

	@Get(WORDS_ENDPOINTS.getManyMarks)
	getManyMarks(@Query() dto: GetWordsMarksDto): Promise<TGetWordsMarksRo> {
		return this.wordsService.getManyMarks(dto);
	}

	@Get(WORDS_ENDPOINTS.getMark)
	getMark(@Param('id') id: string): Promise<IUpsertWordMarkRo> {
		return this.wordsService.getOneMark(+id);
	}
}
