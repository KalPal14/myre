import { IsString } from 'class-validator';

export class CreateWordSetDto {
	@IsString()
	name: string;
}
