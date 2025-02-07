import { IsEmail } from 'class-validator';

export class UserExistenceCheckDto {
	@IsEmail()
	email: string;
}
