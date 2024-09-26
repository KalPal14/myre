import { IsUrl } from 'class-validator';

export class GetPageDto {
	@IsUrl({}, { message: 'The url field must contain a valid link to the page' })
	url: string;
}
