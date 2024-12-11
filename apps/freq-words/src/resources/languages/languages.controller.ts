import { Controller, Get, Param, Query } from '@nestjs/common';

import { LANGUAGES_BASE_ROUTE, LANGUAGES_ENDPOINTS } from '~libs/routes/freq-words';
import { GetLanguagesDto } from '~libs/dto/freq-words';
import { IGetLanguageRo, TGetLanguagesRo } from '~libs/ro/freq-words';
import { Roles } from '~libs/nest-core';

import { LanguagesService } from './languages.service';

@Controller(LANGUAGES_BASE_ROUTE)
export class LanguagesController {
	constructor(private readonly languagesService: LanguagesService) {}

	@Roles('*')
	@Get(LANGUAGES_ENDPOINTS.getMany)
	getMany(@Query() query: GetLanguagesDto): Promise<TGetLanguagesRo> {
		return this.languagesService.getMany(query);
	}

	@Roles('*')
	@Get(LANGUAGES_ENDPOINTS.get)
	getOne(@Param('id') id: string): Promise<IGetLanguageRo> {
		return this.languagesService.getOne(+id);
	}
}
