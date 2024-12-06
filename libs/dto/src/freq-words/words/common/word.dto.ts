import { IsString } from 'class-validator';

export class WordDto {
	@IsString()
	name: string;

	@IsString()
	lemma: string;

	@IsString()
	language: string;
}
