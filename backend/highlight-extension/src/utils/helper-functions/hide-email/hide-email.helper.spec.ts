import { hideEmail } from './hide-email.helper';

describe('hideEmail Helper', () => {
	it('short email username', async () => {
		const result = hideEmail('ed@gmail.com');

		expect(result).toBe('ed***@gmail.com');
	});

	it('long email username', async () => {
		const result = hideEmail('example@gmail.com');

		expect(result).toBe('exa***@gmail.com');
	});
});
