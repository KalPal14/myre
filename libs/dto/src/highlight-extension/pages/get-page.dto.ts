import { IsString, IsUrl } from 'class-validator';

export class GetPageDto {
	@IsString({ message: 'This field must be a number on string format' })
	workspaceId: string;

	@IsUrl({}, { message: 'The url field must contain a valid link to the page' })
	url: string;
}
