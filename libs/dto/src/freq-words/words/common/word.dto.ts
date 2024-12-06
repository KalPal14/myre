import { IsNumber, IsString } from 'class-validator';

export class WordDto {
	@IsNumber()
	languageId: number;

	@IsString()
	name: string;

	@IsString()
	lemma: string;
}
