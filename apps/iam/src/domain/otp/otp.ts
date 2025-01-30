export class Otp {
	constructor(
		readonly email: string,
		readonly code: number
	) {}

	compereOtp(code: number, updatedAt: Date): boolean {
		const now = new Date();
		const diffInMs = now.getTime() - updatedAt.getTime();
		// const threeMinutesInMs = 3 * 60 * 1000;
		const threeMinutesInMs = 30 * 1000;

		if (diffInMs > threeMinutesInMs) {
			return false;
		}
		return this.code === code;
	}
}
