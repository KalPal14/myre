import { Router } from 'express';

import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { TController } from '~libs/express-core';

export interface IPagesController {
	router: Router;

	getPage: TController<null, null, GetPageDto>;
	getPages: TController;
	updatePage: TController<{ id: string }, UpdatePageDto>;
}
