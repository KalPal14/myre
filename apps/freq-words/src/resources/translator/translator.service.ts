import { Injectable } from '@nestjs/common';

import { TranslateDto } from '~libs/dto/freq-words';
import { AiService } from '~libs/nest-core';
import { TTranslateRo } from '~libs/ro/freq-words';

import { translatePrompt } from './prompts/translate.prompt';

@Injectable()
export class TranslatorService {
	constructor(private readonly aiService: AiService) {}

	async translate({ from, to, translate }: TranslateDto): Promise<TTranslateRo | null> {
		// TODO
		return this.aiService.prompt<TTranslateRo>(translatePrompt('Russian', 'English', translate));
	}
}
