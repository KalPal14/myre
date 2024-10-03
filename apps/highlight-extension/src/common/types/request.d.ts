/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
	interface Request {
		user: {
			id: number;
			email: string;
			username: string;
		};
	}
}
