import { Router } from 'express';

import { GetPageDto, GetPagesDto, UpdatePageDto } from '~libs/dto/highlight-extension';
import { TController } from '~libs/express-core';

export interface IPagesController {
	router: Router;

	getFullInfo: TController<null, null, GetPageDto>;
	getPagesShortInfo: TController<null, null, GetPagesDto>;
	update: TController<{ id: string }, UpdatePageDto>;
}
