import { compare, hash } from 'bcryptjs';

import { IUser } from './user.entity.interface';

export class User implements IUser {
	private _password: string;

	constructor(
		private readonly _username: string,
		private readonly _email: string,
		private _colors: string[] = [],
		private _passwordUpdatedAt: Date | null = null,
		passwordHash?: string
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get password(): string {
		return this._password;
	}
	get username(): string {
		return this._username;
	}
	get email(): string {
		return this._email;
	}
	get colors(): string[] {
		return this._colors;
	}
	get passwordUpdatedAt(): Date | null {
		return this._passwordUpdatedAt;
	}

	getData(): IUser {
		return {
			username: this.username,
			email: this.email,
			password: this.password,
			passwordUpdatedAt: this.passwordUpdatedAt,
			colors: this.colors,
		};
	}

	async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}

	async comperePassword(password: string): Promise<boolean> {
		return await compare(password, this._password);
	}
}
