import {
	IsArray,
	Validate,
	ValidatorConstraint,
	isNotEmptyObject,
	isNumber,
	isString,
} from 'class-validator';

import type { ValidatorConstraintInterface } from 'class-validator';

import { IHighlight } from '@/entities/highlight-entity/highlight.entity.interface';
import { isColor } from '@/utils/dto-validation-rules/is-color';

interface IIndividualUpdateHighlightsItem {
	id: number;
	payload: Omit<Partial<IHighlight>, 'startContainer' | 'endContainer'>;
}

@ValidatorConstraint({ async: false })
class IsIndividualUpdateHighlightsItem implements ValidatorConstraintInterface {
	validate({ id, payload }: IIndividualUpdateHighlightsItem): boolean {
		if (!isNumber(id) || !isNotEmptyObject(payload)) return false;

		const {
			pageId,
			order,
			startContainerId,
			endContainerId,
			startOffset,
			endOffset,
			text,
			color,
			note,
			...rest
		} = payload;
		if (isNotEmptyObject(rest)) return false;
		if (pageId && !isNumber(pageId)) return false;
		if (order && !isNumber(order)) return false;
		if (startContainerId && !isNumber(startContainerId)) return false;
		if (endContainerId && !isNumber(endContainerId)) return false;
		if (startOffset && !isNumber(startOffset)) return false;
		if (endOffset && !isNumber(endOffset)) return false;
		if (text && !isString(text)) return false;
		if (color && !isColor(color)) return false;
		if (note && !isString(note)) return false;
		return true;
	}
}

export class IndividualUpdateHighlightsDto {
	@IsArray({ message: 'This field must contain an array' })
	@Validate(IsIndividualUpdateHighlightsItem, {
		each: true,
		message:
			'This field should contain an array of IDs and payloads. The payload should only contain fields for updating the highlight',
	})
	highlights: IIndividualUpdateHighlightsItem[];
}
