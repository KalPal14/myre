import { toWhereIn } from './to-where-in';

describe('toWhereIn', () => {
	it('return the converted object', async () => {
		const ids = [1, 2, 3];
		const names = ['name 1', 'name 2'];

		const result = toWhereIn({ id: ids, name: names });

		expect(result).toEqual({
			id: { in: ids },
			name: { in: names },
		});
	});
});
