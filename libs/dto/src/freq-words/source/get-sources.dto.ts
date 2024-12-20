import { IsNumber } from 'class-validator';

export class GetSourcesDto {
	@IsNumber()
	workspaceId: number;
}
