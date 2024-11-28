import { HttpException, HttpStatus } from '@nestjs/common';

import { IServerValidationErrMsg } from '~libs/common/index';

export class ValidationException extends HttpException {
	constructor(validationErrors: IServerValidationErrMsg[]) {
		super(validationErrors, HttpStatus.BAD_REQUEST);
	}
}
