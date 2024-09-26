import { IsNumber, IsOptional, Validate } from 'class-validator';

import { INode } from '@/entities/node-entity/node.entity.interface';
import { IsColor } from '@/utils/dto-validation-rules/is-color';
import { IsNode } from '@/utils/dto-validation-rules/is-node';

export class UpdateHighlightDto {
	text?: string;
	note?: string | null;

	@IsOptional()
	@Validate(IsNode, {
		message:
			'This field must contain an object containing one string property "text" and two number properties "indexNumber" and "sameElementsAmount".',
	})
	startContainer?: INode;
	@IsOptional()
	@Validate(IsNode, {
		message:
			'This field must contain an object containing one string property "text" and two number properties "indexNumber" and "sameElementsAmount".',
	})
	endContainer?: INode;

	@IsOptional()
	@IsNumber()
	order?: number;
	@IsOptional()
	@IsNumber()
	startOffset?: number;
	@IsOptional()
	@IsNumber()
	endOffset?: number;

	@IsOptional()
	@Validate(IsColor, { message: 'The color field must contain a valid RGB or HEX color' })
	color?: string;
}
