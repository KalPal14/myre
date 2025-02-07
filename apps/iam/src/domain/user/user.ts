import { compare, hash } from 'bcryptjs';

export class User {
	public password: string;

	constructor(
		readonly username: string,
		readonly email: string,
		readonly passwordUpdatedAt: Date | null = null,
		passwordHash?: string
	) {
		if (passwordHash) {
			this.password = passwordHash;
		}
	}

	async setPassword(password: string, salt: number): Promise<void> {
		this.password = await hash(password, salt);
	}

	async comperePassword(password: string): Promise<boolean> {
		return await compare(password, this.password);
	}
}
