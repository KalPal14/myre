import { IsOptional, IsString } from 'class-validator';

export class GetLanguagesDto {
	@IsOptional()
	@IsString()
	q?: string;
}
