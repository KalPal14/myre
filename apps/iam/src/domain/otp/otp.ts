export class Otp {
	constructor(
		readonly email: string,
		readonly code: number
	) {}

	compereOtp(code: number, updatedAt: Date): boolean {
		const now = new Date();
		const diffInMs = now.getTime() - updatedAt.getTime();
		const fiveMinutesInMs = 5 * 60 * 1000;

		if (diffInMs > fiveMinutesInMs) {
			return false;
		}
		return this.code === code;
	}
}
