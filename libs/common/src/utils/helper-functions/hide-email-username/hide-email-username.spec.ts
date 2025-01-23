import { hideEmailUsername } from './hide-email-username';

describe('hideEmailUsername Helper', () => {
	describe('pass email username of 3 characters or shorter', () => {
		it('return hidden email', async () => {
			const result = hideEmailUsername('ed@gmail.com');

			expect(result).toBe('ed***@gmail.com');
		});
	});

	describe('pass email username longer than 3 characters', () => {
		it('return hidden email', async () => {
			const result = hideEmailUsername('example@gmail.com');

			expect(result).toBe('exa***@gmail.com');
		});
	});
});
