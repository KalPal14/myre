export interface IUser {
	username: string;
	email: string;
	colors: string[];
	passwordUpdatedAt: Date | null;
	password: string;
}
