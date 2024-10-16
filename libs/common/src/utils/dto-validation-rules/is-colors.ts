import { ValidatorConstraint } from 'class-validator';

import { isColor } from './is-color';

import type { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsColors implements ValidatorConstraintInterface {
	validate(fieldValue: string[]): boolean {
		if (!Array.isArray(fieldValue)) return false;
		return !fieldValue.map((item) => isColor(item)).includes(false);
	}
}
