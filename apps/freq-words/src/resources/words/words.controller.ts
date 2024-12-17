import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';

import { WORDS_BASE_ROUTE, WORDS_ENDPOINTS } from '~libs/routes/freq-words';
import { GetWordsMarksDto, UpsertWordMarkDto } from '~libs/dto/freq-words';

import { WordsService } from './words.service';
import { WordMark } from './entities/word-mark.entity';

// TODO: Return ROs
@Controller(WORDS_BASE_ROUTE)
export class WordsController {
	constructor(private readonly wordsService: WordsService) {}

	@Patch(WORDS_ENDPOINTS.upsertMark)
	upsertMark(@Body() dto: UpsertWordMarkDto): Promise<WordMark> {
		return this.wordsService.upsertMark(dto);
	}

	@Get(WORDS_ENDPOINTS.getManyMarks)
	getManyMarks(@Query() dto: GetWordsMarksDto): Promise<WordMark[]> {
		return this.wordsService.getManyMarks(dto);
	}

	@Get(WORDS_ENDPOINTS.getMark)
	getMark(@Param('id') id: string): Promise<WordMark> {
		return this.wordsService.getOneMark(+id);
	}
}
