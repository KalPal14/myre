import { IsNumber, IsUrl } from 'class-validator';

export class GetOrCreateSourceDto {
	@IsNumber()
	workspaceId: number;

	@IsUrl()
	link: string;
}
