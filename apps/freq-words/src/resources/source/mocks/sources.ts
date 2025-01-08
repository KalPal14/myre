import { DeepPartial } from 'typeorm';

import { WORKSPACE_ENTITY } from '../../workspaces/mocks/workspaces';
import { Source } from '../entities/source.entity';

export const SOURCE_ENTITY: DeepPartial<Source> = {
	id: 1,
	link: 'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%BF%D0%BE%D1%80%D0%BE%D0%B6%D1%8C%D0%B5',
	workspace: WORKSPACE_ENTITY,
};
