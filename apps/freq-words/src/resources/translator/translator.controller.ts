import { Controller, Get, Query, UnprocessableEntityException } from '@nestjs/common';

import { TRANSLATOR_BASE_ROUTE, TRANSLATOR_ENDPOINTS } from '~libs/routes/freq-words';
import { TranslateDto } from '~libs/dto/freq-words';
import { TTranslateRo } from '~libs/ro/freq-words';
import { Roles } from '~libs/nest-core';

import { TranslatorService } from './translator.service';

@Controller(TRANSLATOR_BASE_ROUTE)
export class TranslatorController {
	constructor(private readonly translatorService: TranslatorService) {}

	@Roles('*')
	@Get(TRANSLATOR_ENDPOINTS.translate)
	async translate(@Query() query: TranslateDto): Promise<TTranslateRo> {
		const result = await this.translatorService.translate(query);
		if (!result) {
			throw new UnprocessableEntityException({ err: 'Failed to translate. Please try again.' });
		}
		return result;
	}
}
