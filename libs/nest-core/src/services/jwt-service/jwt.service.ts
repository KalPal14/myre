import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseJwtService } from '~libs/express-core';

@Injectable()
export class JwtService extends BaseJwtService {
	constructor(protected readonly configService: ConfigService) {
		super();
	}
}
