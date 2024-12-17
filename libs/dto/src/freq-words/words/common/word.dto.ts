import { IsNumber, IsOptional, IsString } from 'class-validator';

export class WordDto {
	@IsNumber()
	languageId: number;

	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	lemma: string | null;
}
