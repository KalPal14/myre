import { ValidatorConstraint, isEmail, matches } from 'class-validator';

import { USERNAME } from '~/iam/common/constants/regexp';

import type { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUserIdentifier implements ValidatorConstraintInterface {
	validate(fieldValue: string): boolean {
		return isEmail(fieldValue) || matches(fieldValue, USERNAME);
	}
}
