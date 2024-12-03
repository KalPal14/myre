import { Controller, Get, Query, UnprocessableEntityException } from '@nestjs/common';

import { TRANSLATION_BASE_ROUTE, TRANSLATION_ENDPOINTS } from '~libs/routes/freq-words';
import { TranslateDto } from '~libs/dto/freq-words';
import { TTranslateRo } from '~libs/ro/freq-words';

import { TranslationService } from './translation.service';

@Controller(TRANSLATION_BASE_ROUTE)
export class TranslationController {
	constructor(private readonly translationService: TranslationService) {}

	@Get(TRANSLATION_ENDPOINTS.translate)
	async translate(@Query() query: TranslateDto): Promise<TTranslateRo> {
		const result = await this.translationService.translate(query);
		if (!result) {
			throw new UnprocessableEntityException({ err: 'Failed to translate. Please try again.' });
		}
		return result;
	}
}
