import { Router } from 'express';

import { GetPageDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { TController } from '~libs/express-core';

export interface IPagesController {
	router: Router;

	getFullInfo: TController<null, null, GetPageDto>;
	getPagesShortInfo: TController;
	update: TController<{ id: string }, UpdatePageDto>;
}
