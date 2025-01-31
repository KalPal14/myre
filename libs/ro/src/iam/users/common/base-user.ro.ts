export interface IBaseUserRo {
	id: number;
	email: string;
	username: string;
	verified: boolean;
	passwordUpdatedAt: Date | null;
}
