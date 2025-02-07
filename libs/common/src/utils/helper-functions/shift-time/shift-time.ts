export function shiftTime(time: { d?: number; h?: number; m?: number; s?: number } | number): Date {
	const date = new Date();

	if (typeof time === 'number') {
		date.setSeconds(new Date().getSeconds() + time);
		return date;
	}

	const { h, m, s } = time;

	if (h) {
		date.setHours(new Date().getHours() + h);
	}
	if (m) {
		date.setMinutes(new Date().getMinutes() + m);
	}
	if (s) {
		date.setSeconds(new Date().getSeconds() + s);
	}
	return date;
}
