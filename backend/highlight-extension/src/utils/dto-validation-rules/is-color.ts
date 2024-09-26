import { ValidatorConstraint, isHexColor, isRgbColor } from 'class-validator';

import type { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsColor implements ValidatorConstraintInterface {
	validate(fieldValue: string): boolean {
		return isRgbColor(fieldValue) || isHexColor(fieldValue);
	}
}

export function isColor(value: string): boolean {
	return isRgbColor(value) || isHexColor(value);
}
