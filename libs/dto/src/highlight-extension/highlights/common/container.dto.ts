import { IsNumber, IsString } from 'class-validator';

export class ContainerDto {
	@IsString({ message: 'The text field is required' })
	text: string;

	@IsNumber({}, { message: 'The indexNumber field must be a number' })
	indexNumber: number;

	@IsNumber({}, { message: 'The sameElementsAmount field must be a number' })
	sameElementsAmount: number;
}
