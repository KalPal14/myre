import { IsNumber, IsUrl } from 'class-validator';

export class CreatePageDto {
	@IsNumber({}, { message: 'This field must be a number' })
	workspaceId: number;

	@IsUrl({}, { message: 'This field must contain a valid link to the page' })
	url: string;
}
