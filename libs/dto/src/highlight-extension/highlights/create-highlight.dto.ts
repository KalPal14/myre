import { Type } from 'class-transformer';
import { IsUrl, ValidateNested, IsNumber, IsString, Validate, IsDefined } from 'class-validator';

import { IsColor } from '~libs/common';

import { ContainerDto } from './common/container.dto';

export class CreateHighlightDto {
	@IsNumber({}, { message: 'This field must contain a number' })
	workspaceId: number;

	@IsUrl({}, { message: 'The pageUrl field must contain a valid link to the page' })
	pageUrl: string;

	@IsDefined({ message: 'The startContainer field must be defined' })
	@ValidateNested()
	@Type(() => ContainerDto)
	startContainer: ContainerDto;

	@IsDefined({ message: 'The startContainer field must be defined' })
	@ValidateNested()
	@Type(() => ContainerDto)
	endContainer: ContainerDto;

	@IsNumber({}, { message: 'This field must be a number' })
	startOffset: number;

	@IsNumber({}, { message: 'This field must be a number' })
	endOffset: number;

	@IsString({ message: 'The text field is required' })
	text: string;

	note?: string;

	@Validate(IsColor, { message: 'The color field must contain a valid RGB or HEX color' })
	color: string;
}
