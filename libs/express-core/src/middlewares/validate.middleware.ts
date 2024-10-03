import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

import { IMiddleware } from './common/types/middleware.interface';

import type { ClassConstructor } from 'class-transformer';

interface IErrMsg {
	property: string;
	value: string | 'undefined';
	errors: string[];
}

export class ValidateMiddleware implements IMiddleware {
	constructor(
		private classToValidate: ClassConstructor<object>,
		private validateMode: 'body' | 'query' = 'body'
	) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, req[this.validateMode]);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				const errorsMsg = this.constructErrorsMsg(errors);
				res.status(422).send(errorsMsg);
				return;
			}
			next();
		});
	}

	private constructErrorsMsg(errors: ValidationError[]): IErrMsg[] {
		return errors.map((err) => ({
			property: err.property,
			value: err.value || 'undefined',
			errors: Object.values(err.constraints || {}),
		}));
	}
}
