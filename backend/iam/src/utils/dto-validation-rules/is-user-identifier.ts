import { ValidatorConstraint, isEmail, matches } from 'class-validator';

import type { ValidatorConstraintInterface } from 'class-validator';

import { USERNAME } from '@/common/constants/regexp';

@ValidatorConstraint({ async: false })
export class IsUserIdentifier implements ValidatorConstraintInterface {
	validate(fieldValue: string): boolean {
		return isEmail(fieldValue) || matches(fieldValue, USERNAME);
	}
}
