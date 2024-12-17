import { IsNumber } from 'class-validator';

export class GetWordsMarksDto {
	@IsNumber()
	workspaceId: number;
}
