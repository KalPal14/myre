import { IsUrl } from 'class-validator';

export class UpdatePageDto {
	@IsUrl({}, { message: 'This field must contain a valid link to the page' })
	url: string;
}
