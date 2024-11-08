import { IsString } from 'class-validator';

export class GetPagesDto {
	@IsString({ message: 'This field must be a number on string format' })
	workspaceId: string;
}
