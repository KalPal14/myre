import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
	@IsOptional()
	@IsString()
	readonly name?: string;

	@IsNumber()
	readonly knownLanguageId: number;

	@IsNumber()
	readonly targetLanguageId: number;
}
