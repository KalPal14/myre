import { IsString } from 'class-validator';

export class UpdateWorkspaceDto {
	@IsString()
	readonly name: string;
}
