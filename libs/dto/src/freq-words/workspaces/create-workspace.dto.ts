import { IsNumber, IsString } from 'class-validator';

export class CreateWorkspaceDto {
	@IsString()
	readonly name: string;

	@IsNumber()
	readonly knownLanguage: number;

	@IsNumber()
	readonly targetLanguage: number;
}
