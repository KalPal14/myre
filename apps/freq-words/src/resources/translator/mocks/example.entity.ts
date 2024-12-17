import { Example } from '../entities/example.entity';

import { DEFINITION_LEMMA, DEFINITION } from './definition.entity';

export const EXAMPLE_LEMMA: Example = {
	id: 1,
	phrase: 'He tried to keep his problems away from the kids',
	definition: DEFINITION_LEMMA,
};

export const EXAMPLE: Example = {
	id: 2,
	phrase: 'He never kept any secrets',
	definition: DEFINITION,
};
