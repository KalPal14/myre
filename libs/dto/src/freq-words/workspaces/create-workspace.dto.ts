import { IsString } from 'class-validator';

export class CreateWorkspaceDto {
	@IsString()
	readonly name: string;

	@IsString()
	readonly knownLanguage: string;

	@IsString()
	readonly targetLanguage: string;
}
