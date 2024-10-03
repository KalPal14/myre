import { Router } from 'express';

import { TController } from '~libs/express-core';

import { GetPageDto } from '~/highlight-extension/dto/pages/get-page.dto';
import { UpdatePageDto } from '~/highlight-extension/dto/pages/update-page.dto';

export interface IPagesController {
	router: Router;

	getPage: TController<null, null, GetPageDto>;
	getPages: TController;
	updatePage: TController<{ id: string }, UpdatePageDto>;
}
