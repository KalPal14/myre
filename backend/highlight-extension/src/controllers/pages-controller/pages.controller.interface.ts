import { Router } from 'express';

import { TController } from '../common/types/controller.type';

import { GetPageDto } from '@/dto/pages/get-page.dto';
import { UpdatePageDto } from '@/dto/pages/update-page.dto';

export interface IPagesController {
	router: Router;

	getPage: TController<null, null, GetPageDto>;
	getPages: TController;
	updatePage: TController<{ id: string }, UpdatePageDto>;
}
