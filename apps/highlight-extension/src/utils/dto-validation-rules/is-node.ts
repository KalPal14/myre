import { ValidatorConstraint, isNumber, isString } from 'class-validator';

import { INode } from '~/highlight-extension/entities/node-entity/node.entity.interface';

import type { ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNode implements ValidatorConstraintInterface {
	validate(node: INode): boolean {
		if (!node) {
			return false;
		}
		if (isString(node.text) && isNumber(node.indexNumber) && isNumber(node.sameElementsAmount)) {
			return true;
		}
		return false;
	}
}
