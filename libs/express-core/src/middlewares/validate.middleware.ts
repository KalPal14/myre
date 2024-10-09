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
		validate(instance, {
			skipMissingProperties: false,
			whitelist: true,
			validationError: { target: false },
		}).then((errors) => {
			if (errors.length > 0) {
				const errorsMsg = this.constructErrorsMsg(errors);
				res.status(422).send(errorsMsg);
				return;
			}
			next();
		});
	}

	private constructErrorsMsg(
		errors: ValidationError[],
		parentProperties: string[] = []
	): IErrMsg[] {
		return errors
			.map((err) => {
				if (err.children?.length) {
					return this.constructErrorsMsg(err.children, [...parentProperties, err.property]);
				}
				return {
					property: parentProperties.length
						? `${parentProperties.join('.')}.${err.property}`
						: err.property,
					value: err.value || 'undefined',
					errors: Object.values(err.constraints || {}),
				};
			})
			.flat();
	}
}
