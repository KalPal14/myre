import { Injectable } from '@nestjs/common';

import { TranslateDto } from '~libs/dto/freq-words';
import { AiService } from '~libs/nest-core';
import { TTranslateRo } from '~libs/ro/freq-words';

import { LanguagesService } from '../languages/languages.service';

import { translatePrompt } from './prompts/translate.prompt';

@Injectable()
export class TranslatorService {
	constructor(
		private aiService: AiService,
		private languagesService: LanguagesService
	) {}

	async translate({ from, to, translate }: TranslateDto): Promise<TTranslateRo | null> {
		const langFrom = await this.languagesService.getOne(from);
		const langTo = await this.languagesService.getOne(to);
		return this.aiService.prompt<TTranslateRo>(
			translatePrompt(langFrom.name, langTo.name, translate)
		);
	}
}
